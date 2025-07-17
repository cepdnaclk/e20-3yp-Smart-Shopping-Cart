//package com.sb.customerservice;
//
//import com.sb.customerbackupservice.grpc.CustomerBackupServiceGrpc;
//import com.sb.customerbackupservice.grpc.CustomerRequest;
//import com.sb.customerbackupservice.grpc.CustomerResponse;
//import com.sb.customerservice.dto.AuthenticationResponse;
//import com.sb.customerservice.dto.LoginUserDTO;
//import com.sb.customerservice.dto.RegisterCustomerDTO;
//import com.sb.customerservice.kafka.KafkaProducer;
//import com.sb.customerservice.model.Customer;
//import com.sb.customerservice.model.Role;
//import com.sb.customerservice.repository.CustomerRepository;
//import com.sb.customerservice.repository.TokenRepository;
//import com.sb.customerservice.service.CustomerServiceImpl;
//import com.sb.customerservice.service.JWTService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.ArgumentCaptor;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.util.ReflectionTestUtils;
//
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.*;
//import static org.junit.jupiter.api.Assertions.assertTrue;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//import static org.mockito.Mockito.verify;
//
//public class CustomerServiceImplTest {
//
//    @InjectMocks
//    private CustomerServiceImpl customerService;
//
//    @Mock
//    private CustomerRepository customerRepository;
//
//    @Mock
//    private JWTService jwtService;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//
//    @Mock
//    private TokenRepository tokenRepository;
//
//    @Mock
//    private Authentication authentication;
//
//    @Mock
//    private CustomerBackupServiceGrpc.CustomerBackupServiceBlockingStub customerBackupServiceBlockingStub;
//
//    @Mock
//    private KafkaProducer kafkaProducer;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        // If you need to mock other collaborators (e.g., for token saving), add them here
//
//        // Manually inject the mock for gRPC stub
//        ReflectionTestUtils.setField(
//                customerService,
//                "customerBackupServiceBlockingStub",
//                customerBackupServiceBlockingStub
//        );
//
//    }
//
//    //Test cases for loginUser method
//
//    //1. Successful login returns AuthenticationResponse
//    @Test
//    void loginUser_SuccessfulLogin_ReturnsAuthenticationResponse() {
//
//        // Arrange
//        LoginUserDTO dto = new LoginUserDTO();
//        dto.setUsername("customer");
//        dto.setPassword("password123");
//
//        Customer customer = new Customer();
//        customer.setUsername("customer");
//        customer.setPassword("hashed-password");
//        customer.setRole(Role.CUSTOMER);
//
//        when(customerRepository.findByUsername("customer")).thenReturn(Optional.of(customer));
//        when(passwordEncoder.matches("password123", "hashed-password")).thenReturn(true);
//        when(jwtService.generateToken(customer)).thenReturn("access-token");
//        when(jwtService.generateRefreshToken(customer)).thenReturn("refresh-token");
//
//        // Act
//        AuthenticationResponse response = customerService.loginCustomer(dto);
//
//        // Assert
//        assertThat(response).isNotNull();
//        assertThat(response.getAccessToken()).isEqualTo("access-token");
//        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
//        assertThat(response.getRole()).isEqualTo(Role.CUSTOMER.name());
//        assertThat(response.getMessage()).isEqualTo("Login successful");
//
//        verify(customerRepository).findByUsername("customer");
//        verify(passwordEncoder).matches("password123", "hashed-password");
//        verify(jwtService).generateToken(customer);
//        verify(jwtService).generateRefreshToken(customer);
//    }
//
//    //2. Username not found throws IllegalArgumentException
//    @Test
//    void loginUser_UsernameNotFound_ThrowsIllegalArgumentException() {
//        // Arrange
//        LoginUserDTO dto = new LoginUserDTO();
//        dto.setUsername("notfound");
//        dto.setPassword("irrelevant");
//
//        when(customerRepository.findByUsername("notfound")).thenReturn(Optional.empty());
//
//        // Act & Assert
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            customerService.loginCustomer(dto);
//        });
//        assertEquals("Invalid username or password", ex.getMessage());
//        verify(customerRepository).findByUsername("notfound");
//    }
//
//    //3. Password mismatch throws IllegalArgumentException
//    @Test
//    void loginUser_PasswordMismatch_ThrowsIllegalArgumentException() {
//        // Arrange
//        LoginUserDTO dto = new LoginUserDTO();
//        dto.setUsername("customer");
//        dto.setPassword("wrongpassword");
//
//        Customer customer = new Customer();
//        customer.setUsername("customer");
//        customer.setPassword("hashed-password");
//        customer.setRole(Role.CUSTOMER);
//
//        when(customerRepository.findByUsername("customer")).thenReturn(Optional.of(customer));
//        when(passwordEncoder.matches("wrongpassword", "hashed-password")).thenReturn(false);
//
//        // Act & Assert
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            customerService.loginCustomer(dto);
//        });
//        assertEquals("Invalid username or password", ex.getMessage());
//        verify(customerRepository).findByUsername("customer");
//        verify(passwordEncoder).matches("wrongpassword", "hashed-password");
//    }
//
//    //4. User with disallowed role throws IllegalArgumentException
//    @Test
//    void loginUser_DisallowedRole_ThrowsIllegalArgumentException() {
//        // Arrange
//        LoginUserDTO dto = new LoginUserDTO();
//        dto.setUsername("customer1");
//        dto.setPassword("password");
//
//        Customer customer = new Customer();
//        customer.setUsername("customer1");
//        customer.setPassword("hashed-password");
//        customer.setRole(Role.CUSTOMER); // Not in allowedRoles
//
//        when(customerRepository.findByUsername("customer1")).thenReturn(Optional.of(customer));
//        when(passwordEncoder.matches("password", "hashed-password")).thenReturn(true);
//
//        // Act & Assert
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            customerService.loginCustomer(dto);
//        });
//        assertEquals("You are not authorized to login.", ex.getMessage());
//        verify(customerRepository).findByUsername("customer1");
//        verify(passwordEncoder).matches("password", "hashed-password");
//    }
//
//    //Test Cases For registerUser method
//
//    // 1. Should register user successfully
//    @Test
//    void registerUser_Success() {
//        RegisterCustomerDTO dto = new RegisterCustomerDTO();
//        dto.setEmail("user@email.com");
//        dto.setNic("123456789V");
//        dto.setPhoneNumber("0771234567");
//        dto.setAddress("No 15, Green Avenue, Colombo");
//        dto.setFirstName("John");
//        dto.setLastName("Doe");
//
//        when(customerRepository.existsByEmail(dto.getEmail())).thenReturn(false);
//        when(customerRepository.existsByNic(dto.getNic())).thenReturn(false);
//        when(customerRepository.existsByPhoneNumber(dto.getPhoneNumber())).thenReturn(false);
//
//        // Registering user
//        Customer registeringCustomer = new Customer();
//        registeringCustomer.setUsername("customer123");
//        registeringCustomer.setRole(Role.CUSTOMER);
//        when(customerRepository.findByUsername("admin123")).thenReturn(Optional.of(registeringCustomer));
//
//        when(passwordEncoder.encode(any())).thenReturn("encodedPw");
//        when(customerRepository.existsByUsername(any())).thenReturn(false); // For unique username generation
//
//        // Save should return the user with ID set (simulate auto-gen)
//        ArgumentCaptor<Customer> savedCustomerCaptor = ArgumentCaptor.forClass(Customer.class);
//        when(customerRepository.save(savedCustomerCaptor.capture())).thenAnswer(invocation -> {
//            Customer customer = invocation.getArgument(0);
//            customer.setId(UUID.randomUUID());
//            return customer;
//        });
//
//        // Mock backup and kafka
//        CustomerRequest customerRequest = mock(CustomerRequest.class);
//        CustomerResponse customerResponse  = mock(CustomerResponse.class);
//        when(customerBackupServiceBlockingStub.saveCustomer(any())).thenReturn(customerResponse);
//
//        doNothing().when(kafkaProducer).sendCustomerCreatedEvent(any(), any());
//
//        String result = customerService.registerCustomer(dto, authentication);
//
//        assertTrue(result.startsWith("Registered successfully with username:"));
//    }
//
//    // 2. Should throw if email already exists
//    @Test
//    void registerUser_EmailExists_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("exists@email.com");
//        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(true);
//
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("Email already exists"));
//    }
//
//    // 3. Should throw if NIC already exists
//    @Test
//    void registerUser_NicExists_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("new@email.com");
//        dto.setNic("nic123");
//        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(false);
//        when(userRepository.existsByNic(dto.getNic())).thenReturn(true);
//
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("NIC already exists"));
//    }
//
//    // 4. Should throw if phone number already exists
//    @Test
//    void registerUser_PhoneExists_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("new@email.com");
//        dto.setNic("nic123");
//        dto.setPhoneNumber("0712345678");
//
//        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(false);
//        when(userRepository.existsByNic(dto.getNic())).thenReturn(false);
//        when(userRepository.existsByPhoneNumber(dto.getPhoneNumber())).thenReturn(true);
//
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("Phone number already exists"));
//    }
//
//    // 5. Should throw if role limit reached
//    @Test
//    void registerUser_RoleLimitReached_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("new@email.com");
//        dto.setNic("nic123");
//        dto.setPhoneNumber("0712345678");
//        dto.setRole(Role.STAFF);
//
//        when(userRepository.existsByEmail(any())).thenReturn(false);
//        when(userRepository.existsByNic(any())).thenReturn(false);
//        when(userRepository.existsByPhoneNumber(any())).thenReturn(false);
//        // Use the real limit from your service (15 for STAFF)
//        when(userRepository.countByRole(Role.STAFF)).thenReturn(15);
//
//        // Mock registering user as ADMIN
//        when(authentication.getName()).thenReturn("admin123");
//        User adminUser = new User();
//        adminUser.setUsername("admin123");
//        adminUser.setRole(Role.ADMIN);
//        when(userRepository.findByUsername("admin123")).thenReturn(Optional.of(adminUser));
//
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("Maximum number of users with role"));
//    }
//
//    // 6. Should throw if registering user not found
//    @Test
//    void registerUser_RegisteringUserNotFound_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("new@email.com");
//        dto.setNic("nic123");
//        dto.setPhoneNumber("0712345678");
//        dto.setRole(Role.STAFF);
//
//        when(userRepository.existsByEmail(any())).thenReturn(false);
//        when(userRepository.existsByNic(any())).thenReturn(false);
//        when(userRepository.existsByPhoneNumber(any())).thenReturn(false);
//        when(userRepository.countByRole(any())).thenReturn(0);
//
//        when(authentication.getName()).thenReturn("ghostUser");
//        when(userRepository.findByUsername("ghostUser")).thenReturn(Optional.empty());
//
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("Registering user not found"));
//    }
//
//    // 7. Should throw if MANAGER registered by non-ADMIN
//    @Test
//    void registerUser_ManagerByNonAdmin_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("email@email.com");
//        dto.setNic("nic123");
//        dto.setPhoneNumber("0712345678");
//        dto.setRole(Role.MANAGER);
//
//        when(userRepository.existsByEmail(any())).thenReturn(false);
//        when(userRepository.existsByNic(any())).thenReturn(false);
//        when(userRepository.existsByPhoneNumber(any())).thenReturn(false);
//        when(userRepository.countByRole(any())).thenReturn(0);
//
//        when(authentication.getName()).thenReturn("staff1");
//        User registeringUser = new User();
//        registeringUser.setUsername("staff1");
//        registeringUser.setRole(Role.STAFF);
//        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(registeringUser));
//
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("Only ADMIN can register a MANAGER."));
//    }
//
//    // 8. Should throw if non-ADMIN/MANAGER tries to register STAFF, SUPPLIER, etc.
//    @Test
//    void registerUser_NonAdminOrManagerRegisteringStaff_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("email@email.com");
//        dto.setNic("nic123");
//        dto.setPhoneNumber("0712345678");
//        dto.setRole(Role.STAFF);
//
//        when(userRepository.existsByEmail(any())).thenReturn(false);
//        when(userRepository.existsByNic(any())).thenReturn(false);
//        when(userRepository.existsByPhoneNumber(any())).thenReturn(false);
//        when(userRepository.countByRole(any())).thenReturn(0);
//
//        when(authentication.getName()).thenReturn("supplier1");
//        User registeringUser = new User();
//        registeringUser.setUsername("supplier1");
//        registeringUser.setRole(Role.SUPPLIER);
//        when(userRepository.findByUsername("supplier1")).thenReturn(Optional.of(registeringUser));
//
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("Only ADMIN or MANAGER can register this role."));
//    }
//
//    // 9. Should throw runtime exception if gRPC or Kafka fails
//    @Test
//    void registerUser_GrpcOrKafkaFails_ThrowsException() {
//        RegisterUserDTO dto = new RegisterUserDTO();
//        dto.setEmail("user@email.com");
//        dto.setNic("123456789V");
//        dto.setPhoneNumber("0771234567");
//        dto.setRole(Role.STAFF);
//        dto.setFirstName("John");
//        dto.setLastName("Doe");
//
//        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(false);
//        when(userRepository.existsByNic(dto.getNic())).thenReturn(false);
//        when(userRepository.existsByPhoneNumber(dto.getPhoneNumber())).thenReturn(false);
//        when(userRepository.countByRole(dto.getRole())).thenReturn(0);
//
//        when(authentication.getName()).thenReturn("admin123");
//        User registeringUser = new User();
//        registeringUser.setUsername("admin123");
//        registeringUser.setRole(Role.ADMIN);
//        when(userRepository.findByUsername("admin123")).thenReturn(Optional.of(registeringUser));
//
//        when(passwordEncoder.encode(any())).thenReturn("encodedPw");
//        when(userRepository.existsByUsername(any())).thenReturn(false);
//
//        // Save returns user with ID set
//        ArgumentCaptor<User> savedUserCaptor = ArgumentCaptor.forClass(User.class);
//        when(userRepository.save(savedUserCaptor.capture())).thenAnswer(invocation -> {
//            User user = invocation.getArgument(0);
//            user.setId(UUID.randomUUID());
//            return user;
//        });
//
//        // Mock backup throws
//        when(userBackupServiceBlockingStub.saveUser(any())).thenThrow(new RuntimeException("gRPC failed"));
//
//        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
//            userService.registerUser(dto, authentication);
//        });
//        assertTrue(ex.getMessage().contains("Customer registration failed due to backup or Kafka error"));
//    }
//
//    // ✅ Should return user details for valid authentication
//    @Test
//    void getUser_ValidAuthentication_ReturnsUserDetails() {
//        // Arrange
//        String username = "john123";
//        when(authentication.getName()).thenReturn(username);
//
//        User user = new User();
//        user.setFirstName("John");
//        user.setLastName("Doe");
//        user.setEmail("john@example.com");
//        user.setPhoneNumber("0771234567");
//        user.setNic("123456789V");
//        user.setRole(Role.STAFF);
//
//        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
//
//        // Act
//        RegisterUserDTO result = userService.getUser(authentication);
//
//        // Assert
//        assertNotNull(result);
//        assertEquals("John", result.getFirstName());
//        assertEquals("Doe", result.getLastName());
//        assertEquals("john@example.com", result.getEmail());
//        assertEquals("0771234567", result.getPhoneNumber());
//        assertEquals("123456789V", result.getNic());
//        assertEquals(Role.STAFF, result.getRole());
//
//        verify(userRepository).findByUsername(username);
//    }
//
//    // ❌ Should throw if user not found
//    @Test
//    void getUser_UserNotFound_ThrowsException() {
//        // Arrange
//        String username = "ghostUser";
//        when(authentication.getName()).thenReturn(username);
//        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
//
//        // Act & Assert
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.getUser(authentication);
//        });
//
//        assertTrue(ex.getMessage().contains("User not found with username"));
//        verify(userRepository).findByUsername(username);
//    }
//
//    // ✅ Should return role when valid token is provided
//    @Test
//    void getRoleFromToken_ValidToken_ReturnsRole() {
//        // Arrange
//        String token = "valid.jwt.token";
//        String username = "john123";
//
//        User user = new User();
//        user.setUsername(username);
//        user.setRole(Role.STAFF);
//
//        when(jwtService.extractUserName(token)).thenReturn(username);
//        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
//
//        // Act
//        Role result = userService.getRoleFromToken(token);
//
//        // Assert
//        assertNotNull(result);
//        assertEquals(Role.STAFF, result);
//        verify(jwtService).extractUserName(token);
//        verify(userRepository).findByUsername(username);
//    }
//
//    // ❌ Should throw if user not found for extracted username
//    @Test
//    void getRoleFromToken_UserNotFound_ThrowsException() {
//        // Arrange
//        String token = "some.jwt.token";
//        String username = "ghostUser";
//
//        when(jwtService.extractUserName(token)).thenReturn(username);
//        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
//
//        // Act & Assert
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.getRoleFromToken(token);
//        });
//
//        assertTrue(ex.getMessage().contains("User not found with username"));
//        verify(jwtService).extractUserName(token);
//        verify(userRepository).findByUsername(username);
//    }
//
//    // ✅ Should delete user successfully when not ADMIN
//    @Test
//    void deleteUser_ValidUser_Success() {
//        // Arrange
//        String username = "user123";
//        User user = new User();
//        user.setUsername(username);
//        user.setRole(Role.STAFF);
//
//        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
//        doNothing().when(userRepository).deleteByUsername(username);
//        doNothing().when(tokenRepository).deleteByUser(user);
//
//        // Mock gRPC call
//        UserResponse grpcResponse = UserResponse.newBuilder().setStatus("OK").build();
//        when(userBackupServiceBlockingStub.deleteUser(any())).thenReturn(grpcResponse);
//
//        // Act
//        String result = userService.deleteUser(username, authentication);
//
//        // Assert
//        assertTrue(result.contains("User deleted successfully"));
//        verify(userRepository).findByUsername(username);
//        verify(userRepository).deleteByUsername(username);
//        verify(tokenRepository).deleteByUser(user);
//        verify(userBackupServiceBlockingStub).deleteUser(any());
//    }
//
//    // ❌ Should throw if user not found
//    @Test
//    void deleteUser_UserNotFound_ThrowsException() {
//        // Arrange
//        String username = "ghostUser";
//        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
//
//        // Act & Assert
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.deleteUser(username, authentication);
//        });
//
//        assertTrue(ex.getMessage().contains("User not found with username"));
//        verify(userRepository).findByUsername(username);
//    }
//
//    // ❌ Should throw if trying to delete ADMIN user
//    @Test
//    void deleteUser_AdminUser_ThrowsException() {
//        // Arrange
//        String username = "admin123";
//        User user = new User();
//        user.setUsername(username);
//        user.setRole(Role.ADMIN);
//
//        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
//
//        // Act & Assert
//        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
//            userService.deleteUser(username, authentication);
//        });
//
//        assertTrue(ex.getMessage().contains("ADMIN account cannot be deleted"));
//        verify(userRepository).findByUsername(username);
//        verify(userRepository, never()).deleteByUsername(any());
//        verify(tokenRepository, never()).deleteByUser(any());
//    }
//
//    // ❌ Should throw if gRPC backup deletion fails
//    @Test
//    void deleteUser_GrpcFails_ThrowsRuntimeException() {
//        // Arrange
//        String username = "user123";
//        User user = new User();
//        user.setUsername(username);
//        user.setRole(Role.STAFF);
//
//        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
//        doNothing().when(userRepository).deleteByUsername(username);
//        doNothing().when(tokenRepository).deleteByUser(user);
//
//        when(userBackupServiceBlockingStub.deleteUser(any()))
//                .thenThrow(new RuntimeException("gRPC failure"));
//
//        // Act & Assert
//        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
//            userService.deleteUser(username, authentication);
//        });
//
//        assertTrue(ex.getMessage().contains("User deletion failed in backup service"));
//        verify(userRepository).deleteByUsername(username);
//        verify(tokenRepository).deleteByUser(user);
//        verify(userBackupServiceBlockingStub).deleteUser(any());
//    }
//
//
//}
