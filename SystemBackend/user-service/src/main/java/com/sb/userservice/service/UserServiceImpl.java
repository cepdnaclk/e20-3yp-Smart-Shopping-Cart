package com.sb.userservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sb.backupservice.grpc.UserBackupServiceGrpc;
import com.sb.backupservice.grpc.UserRequest;
import com.sb.backupservice.grpc.UserResponse;
import com.sb.userservice.dto.AuthenticationResponse;
import com.sb.userservice.dto.ChangePasswordRequestDTO;
import com.sb.userservice.dto.LoginUserDTO;
import com.sb.userservice.dto.RegisterUserDTO;
import com.sb.userservice.kafka.KafkaProducer;
import com.sb.userservice.model.Role;
import com.sb.userservice.model.Token;
import com.sb.userservice.model.TokenType;
import com.sb.userservice.model.User;
import com.sb.userservice.repository.TokenRepository;
import com.sb.userservice.repository.UserRepository;
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
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;

    private final KafkaProducer kafkaProducer;

    private final TokenRepository tokenRepository;

    private final JWTService jwtService;

    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, KafkaProducer kafkaProducer,
                           TokenRepository tokenRepository, JWTService jwtService,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
        this.kafkaProducer = kafkaProducer;
        this.passwordEncoder = passwordEncoder;
    }

    @GrpcClient("user-backup-service")
    private UserBackupServiceGrpc.UserBackupServiceBlockingStub userBackupServiceBlockingStub;

    private final Random random = new SecureRandom();
    private static final String SYMBOLS = "!@#$%&*";
    private static final String UPPER = "ABCDEFGHJKMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghjkmnpqrstuvwxyz";
    private static final String DIGITS = "23456789";

    private static final Map<Role, Integer> MAX_ROLE_LIMITS = Map.of(
            Role.ADMIN, 1,
            Role.MANAGER, 2,
            Role.CASHIER, 10,
            Role.STAFF, 15,
            Role.SECURITY, 8
            // Role.SUPPLIER has no limit
    );

    private com.sb.backupservice.grpc.Role convertToGrpcRole(Role role) {
        return switch (role) {
            case ADMIN -> com.sb.backupservice.grpc.Role.ADMIN;
            case MANAGER -> com.sb.backupservice.grpc.Role.MANAGER;
            case CASHIER -> com.sb.backupservice.grpc.Role.CASHIER;
            case SECURITY -> com.sb.backupservice.grpc.Role.SECURITY;
            case SUPPLIER -> com.sb.backupservice.grpc.Role.SUPPLIER;
            case STAFF -> com.sb.backupservice.grpc.Role.STAFF;
            case GUEST -> com.sb.backupservice.grpc.Role.GUEST;
        };
    }

    @Override
    @Transactional(readOnly = false)
    public String registerUser(RegisterUserDTO registerUserDTO, Authentication authentication) {

        // ✅ Check for duplicate email
        if (userRepository.existsByEmail(registerUserDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + registerUserDTO.getEmail());
        }

        // ✅ Check for duplicate NIC
        if (userRepository.existsByNic(registerUserDTO.getNic())) {
            throw new IllegalArgumentException("NIC already exists: " + registerUserDTO.getNic());
        }

        // ✅ Check for duplicate phone number
        if (userRepository.existsByPhoneNumber(registerUserDTO.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists: " + registerUserDTO.getPhoneNumber());
        }

        Role requestedRole = registerUserDTO.getRole();

        if (MAX_ROLE_LIMITS.containsKey(requestedRole)) {
            int currentCount = userRepository.countByRole(requestedRole);
            int maxAllowed = MAX_ROLE_LIMITS.get(requestedRole);

            if (currentCount >= maxAllowed) {
                throw new IllegalArgumentException("Maximum number of users with role " + requestedRole + " already exists.");
            }
        }

        String username = generateUniqueUsername(requestedRole);
        String password = generateSecurePassword();

        logger.info("🔐 Generated username: {}, password: {}", username, password);

        String encodedPassword = passwordEncoder.encode(password); // 🔒 Encode the password

        final String resolvedRegisteredBy;
        Role registeredByRole;

        if (registerUserDTO.getRole() == Role.ADMIN && authentication == null) {
            // System initializing first admin
            resolvedRegisteredBy = "System";
            registeredByRole = Role.ADMIN;
        } else {
            resolvedRegisteredBy = authentication.getName();
            registeredByRole = userRepository.findByUsername(resolvedRegisteredBy)
                    .orElseThrow(() -> {
                        logger.warn("❌ Registering user not found: {}", resolvedRegisteredBy);
                        return new IllegalArgumentException("Registering user not found: " + resolvedRegisteredBy);
                    }).getRole();
        }

        // 🚫 Authorization logic
        if (requestedRole == Role.MANAGER && registeredByRole != Role.ADMIN) {
            throw new IllegalArgumentException("Only ADMIN can register a MANAGER.");
        }

        if (requestedRole != Role.MANAGER && requestedRole != Role.ADMIN &&
                !(registeredByRole == Role.ADMIN || registeredByRole == Role.MANAGER)) {
            throw new IllegalArgumentException("Only ADMIN or MANAGER can register this role.");
        }

        User user = new User();
        user.setFirstName(registerUserDTO.getFirstName());
        user.setLastName(registerUserDTO.getLastName());
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setEmail(registerUserDTO.getEmail());
        user.setNic(registerUserDTO.getNic());
        user.setPhoneNumber(registerUserDTO.getPhoneNumber());
        user.setRole(requestedRole);
        user.setRegisteredBy(resolvedRegisteredBy);
        user.setRegistrationDate(LocalDate.now());

        // Save to main DB
        userRepository.save(user);

        UserRequest backupRequest = UserRequest.newBuilder()
                .setId(user.getId().toString())
                .setFirstName(user.getFirstName())
                .setLastName(user.getLastName())
                .setUsername(user.getUsername())
                .setPassword(password)
                .setEmail(user.getEmail())
                .setPhoneNumber(user.getPhoneNumber())
                .setNic(user.getNic())
                .setRole(convertToGrpcRole(user.getRole()))
                .setRegistrationDate(user.getRegistrationDate().toString())
                .setRegisteredBy(user.getRegisteredBy())
                .build();

        try {
            // Step 1: Backup via gRPC
            UserResponse response = userBackupServiceBlockingStub.saveUser(backupRequest);
            logger.info("Backup Response: {}", response.getStatus());

            // Step 2: Produce Kafka event for mail-service
            kafkaProducer.sendUserCreatedEvent("user-events", backupRequest);
            logger.info("Kafka event sent to topic: user-events");

        } catch (Exception e) {
            logger.error("Backup or Kafka failed: {}", e.getMessage(), e);
            throw new RuntimeException("Customer registration failed due to backup or Kafka error", e);
        }

        return "Registered successfully with username: " + username + " and password: " + password;
    }

    @Override
    @Transactional
    public String updateUser(RegisterUserDTO registerUserDTO, Authentication authentication) {

        String username = authentication.getName();

        logger.info("🔄 Attempting to update User with username: {}", username);

        // Check if user exists
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("❌ User not found with username: {}", username);
                    return new IllegalArgumentException("User not found with username: " + username);
                });

        // 📝 Update fields only if not null
        if (registerUserDTO.getFirstName() != null) user.setFirstName(registerUserDTO.getFirstName());
        if (registerUserDTO.getLastName() != null) user.setLastName(registerUserDTO.getLastName());
        if (registerUserDTO.getEmail() != null) user.setEmail(registerUserDTO.getEmail());
        if (registerUserDTO.getPhoneNumber() != null) user.setPhoneNumber(registerUserDTO.getPhoneNumber());
        if (registerUserDTO.getNic() != null) user.setNic(registerUserDTO.getNic());

        // 💾 Save to main DB
        userRepository.save(user);
        logger.info("✅ User updated in main database for username: {}", username);

        // 📦 Prepare gRPC backup request
        UserRequest grpcRequest = UserRequest.newBuilder()
                .setId(user.getId().toString())
                .setFirstName(user.getFirstName() != null ? user.getFirstName() : "")
                .setLastName(user.getLastName() != null ? user.getLastName() : "")
                .setUsername(user.getUsername())
                .setPassword(user.getPassword()) // Password remains unchanged
                .setEmail(user.getEmail() != null ? user.getEmail() : "")
                .setPhoneNumber(user.getPhoneNumber() != null ? user.getPhoneNumber() : "")
                .setNic(user.getNic() != null ? user.getNic() : "")
                .setRole(convertToGrpcRole(user.getRole()))
                .setRegistrationDate(user.getRegistrationDate().toString())
                .setRegisteredBy(user.getRegisteredBy())
                .build();

        try {
            // 🔁 Perform gRPC update
            UserResponse grpcResponse = userBackupServiceBlockingStub.saveUser(grpcRequest);
            logger.info("📡 Backup updated successfully via gRPC: {}", grpcResponse.getStatus());
        } catch (Exception e) {
            logger.error("❌ Failed to update customer in backup database via gRPC", e);
            throw new RuntimeException("Backup update failed: " + e.getMessage(), e);
        }

        return "✅ User updated successfully: " + username;
    }

    @Override
    @Transactional(readOnly = true)
    public RegisterUserDTO getUser(Authentication authentication) {

        String username = authentication.getName();

        logger.info("🔍 Fetching user details for username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("❌ User not found with username: {}", username);
                    return new IllegalArgumentException("User not found with username: " + username);
                });

        // 📨 Map User entity to DTO
        RegisterUserDTO dto = new RegisterUserDTO();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setNic(user.getNic());
        dto.setRole(user.getRole());

        logger.info("✅ Successfully retrieved user details for username: {}", username);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Role getRoleFromToken(String jwtToken) {
        String username = jwtService.extractUserName(jwtToken);
        logger.info("🔍 Fetching role for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("❌ User not found with username: {}", username);
                    return new IllegalArgumentException("User not found with username: " + username);
                });

        logger.info("✅ Role retrieved for user {}: {}", username, user.getRole());
        return user.getRole();
    }


    @Override
    @Transactional
    public String deleteUser(String username,Authentication authentication) {

        // Check if user exists
        userRepository.findByUsername(username).ifPresentOrElse(user -> {
            logger.info("🔍 User found for deletion: {}", username);

            // Prevent deletion if the user is ADMIN
            if (user.getRole() == Role.ADMIN) {
                logger.warn("❌ Attempt to delete ADMIN account: {}", username);
                throw new IllegalArgumentException("ADMIN account cannot be deleted.");
            }

            // Delete user from main DB
            userRepository.deleteByUsername(username);

            logger.info("✅ User deleted from main database: {}", username);

            tokenRepository.deleteByUser(user);

            logger.info("✅ Tokens deleted for user: {}", username);
        }, () -> {
            logger.warn("❌ User not found for deletion: {}", username);
            throw new IllegalArgumentException("User not found with username: " + username);
        });


        try {
            // Call gRPC to delete from backup DB
            com.sb.backupservice.grpc.DeleteUserRequest grpcRequest =
                    com.sb.backupservice.grpc.DeleteUserRequest.newBuilder()
                            .setUsername(username)
                            .build();

            UserResponse response = userBackupServiceBlockingStub.deleteUser(grpcRequest);
            logger.info("Backup deletion response: {}", response.getStatus());

        } catch (Exception e) {
            logger.error("Failed to delete User from backup service via gRPC", e);
            throw new RuntimeException("User deletion failed in backup service", e);
        }

        return "User deleted successfully: " + username;

    }

    @Override
    @Transactional
    public AuthenticationResponse loginUser(LoginUserDTO loginUserDTO) {

        logger.info("🔐 Attempting login for username: {}", loginUserDTO.getUsername());

        // 🔍 Find user by username
        User user = userRepository.findByUsername(loginUserDTO.getUsername())
                .orElseThrow(() -> {
                    logger.warn("❌ Username not found: {}", loginUserDTO.getUsername());
                    return new IllegalArgumentException("Invalid username or password");
                });

        // 🔒 Verify password
        if (!passwordEncoder.matches(loginUserDTO.getPassword(), user.getPassword())) {
            logger.warn("❌ Password mismatch for username: {}", loginUserDTO.getUsername());
            throw new IllegalArgumentException("Invalid username or password");
        }

        // ✅ Only allow specific roles to login
        EnumSet<Role> allowedRoles = EnumSet.of(
                Role.ADMIN, Role.MANAGER, Role.CASHIER, Role.SECURITY, Role.SUPPLIER, Role.STAFF
        );
        if (!allowedRoles.contains(user.getRole())) {
            logger.warn("❌ User '{}' has disallowed role '{}'. Login denied.", loginUserDTO.getUsername(), user.getRole());
            throw new IllegalArgumentException("You are not authorized to login.");
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        logger.info("✅ Tokens generated for user: {}", user.getUsername());

        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setRole(user.getRole().name());
        response.setMessage("Login successful");

        logger.info("✅ User {} logged in successfully", user.getUsername());
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

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            logger.warn("❌ No customer found for username: {}", username);
            return;
        }

        User user = userOptional.get();

        if (jwtService.validateToken(refreshToken, user)) {
            logger.info("✅ Refresh token is valid for user: {}", username);

            String newAccessToken = jwtService.generateToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, newAccessToken);

            AuthenticationResponse authResponse = new AuthenticationResponse();
            authResponse.setAccessToken(newAccessToken);
            authResponse.setRefreshToken(refreshToken);
            authResponse.setRole(user.getRole().name());
            authResponse.setMessage("Token refreshed");

            new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            logger.info("✅ New access token sent for user: {}", username);
        } else {
            logger.warn("❌ Invalid refresh token for user: {}", username);
        }
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequestDTO request, Authentication authentication) {

        String username = authentication.getName();

        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            logger.warn("❌ User not found for password change: {}", username);
            throw new IllegalArgumentException("User not found with username: " + username);
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            logger.warn("❌ Old password mismatch for user: {}", username);
            throw new IllegalArgumentException("Old password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            logger.warn("❌ New password and confirmation do not match for user: {}", username);
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedNewPassword);
        userRepository.save(user);
        logger.info("✅ Password changed successfully for user: {}", username);


    }

    @Override
    public void forgetPassword(String username, String email) {

    }

    @Override
    public void resetPasswordWithCode(String email, String code, ChangePasswordRequestDTO request) {

    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return; // No tokens to revoke
        }

        validUserTokens.forEach(t -> {
            t.setExpired(true); // Mark the token as expired
            t.setRevoked(true); // Mark the token as revoked
        });
        tokenRepository.saveAll(validUserTokens); // Save changes to the database
    }

    private void saveUserToken(User user, String jwtToken) {

        // 🔐 Create a new token for the user
        Token token = new Token();

        token.setUser(user);
        token.setToken(jwtToken);
        token.setTokenType(TokenType.BEARER);
        token.setRevoked(false);
        token.setExpired(false);

        tokenRepository.save(token); // Save the token to the database
    }

    private String generateUniqueUsername(Role role) {
        String prefix;
        int numDigits;

        switch (role) {
            case ADMIN:
                prefix = "ADMIN";
                numDigits = 2;
                break;
            case MANAGER:
                prefix = "MGT";
                numDigits = 4;
                break;
            case CASHIER:
                prefix = "CASH";
                numDigits = 4;
                break;
            case STAFF:
                prefix = "STA";
                numDigits = 4;
                break;
            case SECURITY:
                prefix = "SEC";
                numDigits = 4;
                break;
            case SUPPLIER:
                prefix = "SUP";
                numDigits = 4;
                break;
            default:
                prefix = "USER";
                numDigits = 5;
        }

        String username;
        do {
            StringBuilder sb = new StringBuilder(prefix);
            for (int i = 0; i < numDigits; i++) {
                sb.append((int)(Math.random() * 10));
            }
            username = sb.toString();
        } while (userRepository.existsByUsername(username));
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

}
