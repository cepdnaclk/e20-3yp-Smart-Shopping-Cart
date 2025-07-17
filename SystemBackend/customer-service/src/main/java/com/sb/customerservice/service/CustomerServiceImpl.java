package com.sb.customerservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sb.customerbackupservice.grpc.CustomerBackupServiceGrpc;
import com.sb.customerbackupservice.grpc.CustomerRequest;
import com.sb.customerbackupservice.grpc.CustomerResponse;
import com.sb.customerservice.dto.AuthenticationResponse;
import com.sb.customerservice.dto.LoginUserDTO;
import com.sb.customerservice.dto.RegisterCustomerDTO;
import com.sb.customerservice.kafka.KafkaProducer;
import com.sb.customerservice.model.Customer;
import com.sb.customerservice.model.Role;
import com.sb.customerservice.model.Token;
import com.sb.customerservice.model.TokenType;
import com.sb.customerservice.repository.CustomerRepository;
import com.sb.customerservice.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Random;

@Service
public class CustomerServiceImpl implements CustomerService {

    private static final Logger logger = LoggerFactory.getLogger(CustomerServiceImpl.class);

    private final CustomerRepository customerRepository;

    private final KafkaProducer kafkaProducer;

    private final PasswordEncoder passwordEncoder;

    private final TokenRepository tokenRepository;

    private final JWTService jwtService;

    @GrpcClient("customer-backup-service")
    private CustomerBackupServiceGrpc.CustomerBackupServiceBlockingStub customerBackupStub;

    private final Random random = new SecureRandom();
    private static final String SYMBOLS = "!@#$%&*";
    private static final String UPPER = "ABCDEFGHJKMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghjkmnpqrstuvwxyz";
    private static final String DIGITS = "23456789";

    public CustomerServiceImpl(CustomerRepository customerRepository, KafkaProducer kafkaProducer, PasswordEncoder passwordEncoder, TokenRepository tokenRepository, JWTService jwtService) {
        this.customerRepository = customerRepository;
        this.kafkaProducer = kafkaProducer;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional()
    public String registerCustomer(RegisterCustomerDTO dto) {

        // ✅ Check for duplicate email
        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }

        // ✅ Check for duplicate NIC
        if (customerRepository.existsByNic(dto.getNic())) {
            throw new IllegalArgumentException("NIC already exists: " + dto.getNic());
        }

        // ✅ Check for duplicate phone number
        if (customerRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists: " + dto.getPhoneNumber());
        }

        String username = generateUniqueUsername();
        String password = generateSecurePassword();

        // 🔒 Encode the password
        String encodedPassword = passwordEncoder.encode(password);

        Customer customer = new Customer();
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setUsername(username);
        customer.setPassword(encodedPassword);
        customer.setEmail(dto.getEmail());
        customer.setNic(dto.getNic());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setAddress(dto.getAddress());
        customer.setRegistrationDate(LocalDate.now());
        customer.setRole(Role.CUSTOMER);

        // Save to main DB
        customerRepository.save(customer);

        CustomerRequest backupRequest = CustomerRequest.newBuilder()
                .setId(customer.getId().toString())
                .setFirstName(customer.getFirstName())
                .setLastName(customer.getLastName())
                .setUsername(customer.getUsername())
                .setPassword(password)
                .setEmail(customer.getEmail())
                .setPhoneNumber(customer.getPhoneNumber())
                .setNic(customer.getNic())
                .setAddress(customer.getAddress())
                .setRegistrationDate(customer.getRegistrationDate().toString())
                .build();

        try {
            // Step 1: Backup via gRPC
            CustomerResponse response = customerBackupStub.saveCustomer(backupRequest);
            logger.info("Backup Response: {}", response.getStatus());

            // Step 2: Produce Kafka event for mail-service
            kafkaProducer.sendCustomerCreatedEvent("customer-events", backupRequest);
            logger.info("Kafka event sent to topic: customer-events");

        } catch (Exception e) {
            logger.error("Backup or Kafka failed: {}", e.getMessage(), e);
            throw new RuntimeException("Customer registration failed due to backup or Kafka error", e);
        }

        return "Registered successfully with username: " + username + " and password: " + password;
    }

    @Override
    @Transactional
    public AuthenticationResponse loginCustomer(LoginUserDTO loginUserDTO) {

        logger.info("🔐 Attempting login for username: {}", loginUserDTO.getUsername());

        // 🔍 Find customer by username
        Customer customer = customerRepository.findByUsername(loginUserDTO.getUsername())
                .orElseThrow(() -> {
                    logger.warn("❌ Username not found: {}", loginUserDTO.getUsername());
                    return new IllegalArgumentException("Invalid username or password");
                });

        // 🔒 Verify password
        if (!passwordEncoder.matches(loginUserDTO.getPassword(), customer.getPassword())) {
            logger.warn("❌ Password mismatch for username: {}", loginUserDTO.getUsername());
            throw new IllegalArgumentException("Invalid username or password");
        }

        String accessToken = jwtService.generateToken(customer);
        String refreshToken = jwtService.generateRefreshToken(customer);

        logger.info("✅ Tokens generated for user: {}", customer.getUsername());

        revokeAllCustomerTokens(customer);
        saveCustomerToken(customer, accessToken);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setRole(customer.getRole().name());
        response.setMessage("Login successful");

        logger.info("✅ User {} logged in successfully", customer.getUsername());
        return response;
    }

    @Override
    @Transactional
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("❌ Refresh token header is missing or invalid");
            return;
        }

        refreshToken = authHeader.substring(7);
        username = jwtService.extractUserName(refreshToken);

        if (username == null) {
            logger.warn("❌ Could not extract username from refresh token");
            return;
        }

        logger.info("🔄 Refresh token received for username: {}", username);

        Optional<Customer> customerOptional = customerRepository.findByUsername(username);
        if (customerOptional.isEmpty()) {
            logger.warn("❌ No customer found for username: {}", username);
            return;
        }

        Customer customer = customerOptional.get();

        if (jwtService.validateToken(refreshToken, customer)) {
            logger.info("✅ Refresh token is valid for user: {}", username);

            String newAccessToken = jwtService.generateToken(customer);
            revokeAllCustomerTokens(customer);
            saveCustomerToken(customer, newAccessToken);

            AuthenticationResponse authResponse = new AuthenticationResponse();
            authResponse.setAccessToken(newAccessToken);
            authResponse.setRefreshToken(refreshToken);
            authResponse.setRole(customer.getRole().name());
            authResponse.setMessage("Token refreshed");

            new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            logger.info("✅ New access token sent for user: {}", username);
        } else {
            logger.warn("❌ Invalid refresh token for user: {}", username);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Role getRoleFromToken(String jwtToken) {
        String username = jwtService.extractUserName(jwtToken);
        logger.info("🔍 Fetching role for user: {}", username);

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("❌ User not found with username: {}", username);
                    return new IllegalArgumentException("User not found with username: " + username);
                });

        logger.info("✅ Role retrieved for user {}: {}", username, customer.getRole());
        return customer.getRole();
    }

    private void revokeAllCustomerTokens(Customer customer) {
        var validUserTokens = tokenRepository.findAllValidTokenByCustomer(customer.getId());
        if (validUserTokens.isEmpty()) {
            return; // No tokens to revoke
        }

        validUserTokens.forEach(t -> {
            t.setExpired(true); // Mark the token as expired
            t.setRevoked(true); // Mark the token as revoked
        });
        tokenRepository.saveAll(validUserTokens); // Save changes to the database
    }

    private void saveCustomerToken(Customer customer, String jwtToken) {

        // 🔐 Create a new token for the customer
        Token token = new Token();

        token.setCustomer(customer);
        token.setToken(jwtToken);
        token.setTokenType(TokenType.BEARER);
        token.setRevoked(false);
        token.setExpired(false);

        tokenRepository.save(token); // Save the token to the database
    }

    @Override
    @Transactional
    public String updateCustomer(RegisterCustomerDTO dto, Authentication authentication) {

        String username = authentication.getName(); // Get username from authentication

        logger.info("🔄 Attempting to update customer with username: {}", username);

        // 🔍 Find existing customer by username
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("❌ Customer not found with username: {}", username);
                    return new IllegalArgumentException("Customer not found with username: " + username);
                });

        // 📝 Update fields only if not null
        if (dto.getFirstName() != null) customer.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) customer.setLastName(dto.getLastName());
        if (dto.getEmail() != null) customer.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) customer.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getNic() != null) customer.setNic(dto.getNic());
        if (dto.getAddress() != null) customer.setAddress(dto.getAddress());

        // 💾 Save to main DB
        customerRepository.save(customer);
        logger.info("✅ Customer updated in main database for username: {}", username);

        // 📦 Prepare gRPC backup request
        CustomerRequest grpcRequest = CustomerRequest.newBuilder()
                .setId(customer.getId().toString())
                .setFirstName(customer.getFirstName() != null ? customer.getFirstName() : "")
                .setLastName(customer.getLastName() != null ? customer.getLastName() : "")
                .setUsername(customer.getUsername())
                .setPassword(customer.getPassword()) // Password remains unchanged
                .setEmail(customer.getEmail() != null ? customer.getEmail() : "")
                .setPhoneNumber(customer.getPhoneNumber() != null ? customer.getPhoneNumber() : "")
                .setNic(customer.getNic() != null ? customer.getNic() : "")
                .setAddress(customer.getAddress() != null ? customer.getAddress() : "")
                .setRegistrationDate(customer.getRegistrationDate().toString())
                .build();

        try {
            // 🔁 Perform gRPC update
            CustomerResponse grpcResponse = customerBackupStub.saveCustomer(grpcRequest);
            logger.info("📡 Backup updated successfully via gRPC: {}", grpcResponse.getStatus());
        } catch (Exception e) {
            logger.error("❌ Failed to update customer in backup database via gRPC", e);
            throw new RuntimeException("Backup update failed: " + e.getMessage(), e);
        }

        return "✅ Customer updated successfully: " + username;
    }

    @Override
    @Transactional(readOnly = true)
    public RegisterCustomerDTO getCustomer(Authentication authentication) {

        String username = authentication.getName(); // Get username from authentication
        logger.info("🔍 Fetching customer details for username: {}", username);

        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("❌ Customer not found with username: {}", username);
                    return new IllegalArgumentException("Customer not found with username: " + username);
                });

        // 📨 Map Customer entity to DTO
        RegisterCustomerDTO dto = new RegisterCustomerDTO();
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setNic(customer.getNic());
        dto.setAddress(customer.getAddress());

        logger.info("✅ Successfully retrieved customer details for username: {}", username);
        return dto;
    }


    private String generateUniqueUsername() {
        String username;
        do {
            int number = random.nextInt(100_000); // 0 to 99999
            username = "USER" + String.format("%05d", number);
        } while (customerRepository.existsByUsername(username));
        return username;
    }

    private String generateSecurePassword() {
        StringBuilder password = new StringBuilder();

        // Ensure 1 uppercase, 2 digits, 1 symbol, and fill the rest
        password.append(randomChar(UPPER));
        password.append(randomChar(DIGITS));
        password.append(randomChar(DIGITS));
        password.append(randomChar(SYMBOLS));

        while (password.length() < 8) {
            password.append(randomChar(LOWER + DIGITS + SYMBOLS));
        }

        // Shuffle characters
        return shuffle(password.toString());
    }

    private char randomChar(String source) {
        return source.charAt(random.nextInt(source.length()));
    }

    private String shuffle(String input) {
        char[] array = input.toCharArray();
        for (int i = array.length - 1; i > 0; i--) {
            int index = random.nextInt(i + 1);
            char temp = array[i];
            array[i] = array[index];
            array[index] = temp;
        }
        return new String(array);
    }

    @Override
    @Transactional
    public String deleteCustomer(String username) {

        // Check if customer exists
        customerRepository.findByUsername(username).ifPresentOrElse(customer -> {

            // Delete customer from main DB
            customerRepository.deleteByUsername(username);

            logger.info("✅ Customer deleted from main database: {}", username);

            tokenRepository.deleteByCustomer(customer);

            logger.info("✅ All tokens deleted for customer: {}", username);

        }, () -> {;
            logger.warn("❌ Customer not found with username: {}", username);
            throw new IllegalArgumentException("Customer not found with username: " + username);
        });


        try {
            // Call gRPC to delete from backup DB
            com.sb.customerbackupservice.grpc.DeleteCustomerRequest grpcRequest =
                    com.sb.customerbackupservice.grpc.DeleteCustomerRequest.newBuilder()
                            .setUsername(username)
                            .build();

            CustomerResponse response = customerBackupStub.deleteCustomer(grpcRequest);
            logger.info("Backup deletion response: {}", response.getStatus());

        } catch (Exception e) {
            logger.error("Failed to delete customer from backup service via gRPC", e);
            throw new RuntimeException("Customer deletion failed in backup service", e);
        }

        return "Customer deleted successfully: " + username;
    }

}
