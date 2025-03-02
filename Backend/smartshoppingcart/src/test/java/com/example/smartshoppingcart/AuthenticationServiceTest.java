package com.example.smartshoppingcart;

import com.example.smartshoppingcart.DTO.AuthenticationResponse;
import com.example.smartshoppingcart.DTO.LoginUserDTO;
import com.example.smartshoppingcart.DTO.RegisterUserDTO;
import com.example.smartshoppingcart.Model.Role;
import com.example.smartshoppingcart.Model.Token;
import com.example.smartshoppingcart.Model.TokenType;
import com.example.smartshoppingcart.Model.Users;
import com.example.smartshoppingcart.Repository.TokenRepository;
import com.example.smartshoppingcart.Repository.UserRepository;
import com.example.smartshoppingcart.Service.AuthenticationServiceImpl;
import com.example.smartshoppingcart.Service.JWTService;
import com.example.smartshoppingcart.Service.MailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private MailService mailService;

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    private RegisterUserDTO registerUserDTO;
    private LoginUserDTO loginUserDTO;
    private Users user;

    @BeforeEach
    void setUp() {
        registerUserDTO = new RegisterUserDTO();
        registerUserDTO.setFirstName("John");
        registerUserDTO.setLastName("Doe");
        registerUserDTO.setEmail("john.doe@example.com");
        registerUserDTO.setPhone("1234567890");
        registerUserDTO.setNic("123456789V");
        registerUserDTO.setRole(Role.USER);

        loginUserDTO = new LoginUserDTO();
        loginUserDTO.setUsername("USR12345");
        loginUserDTO.setPassword("password");

        user = Users.builder()
                .username("USR12345")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("encodedPassword")
                .phone("1234567890")
                .nic("123456789V")
                .role(Role.USER)
                .build();
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.findByNic(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(jwtService.generateToken(any(Users.class))).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(any(Users.class))).thenReturn("refreshToken");
        when(userRepository.save(any(Users.class))).thenReturn(user);

        AuthenticationResponse response = authenticationService.registerUser(registerUserDTO);

        assertNotNull(response);
        assertEquals("jwtToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("User Registered Successfully and Email Sent", response.getMessage());
        assertEquals("USER", response.getRole());

        verify(userRepository, times(1)).findByEmail(anyString());
        verify(userRepository, times(1)).findByNic(anyString());
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(jwtService, times(1)).generateToken(any(Users.class));
        verify(jwtService, times(1)).generateRefreshToken(any(Users.class));
        verify(userRepository, times(1)).save(any(Users.class));
        verify(mailService, times(1)).sendLoginDetails(anyString(), anyString(), anyString());
    }

    @Test
    void testRegisterUser_UserAlreadyExists() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        assertThrows(AuthenticationServiceImpl.UserAlreadyExistsException.class, () -> {
            authenticationService.registerUser(registerUserDTO);
        });

        verify(userRepository, times(1)).findByEmail(anyString());
        verify(userRepository, times(0)).findByNic(anyString());
        verify(passwordEncoder, times(0)).encode(anyString());
        verify(jwtService, times(0)).generateToken(any(Users.class));
        verify(jwtService, times(0)).generateRefreshToken(any(Users.class));
        verify(userRepository, times(0)).save(any(Users.class));
        verify(mailService, times(0)).sendLoginDetails(anyString(), anyString(), anyString());
    }

    @Test
    void testLoginUser_Success() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(Users.class))).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(any(Users.class))).thenReturn("refreshToken");

        AuthenticationResponse response = authenticationService.loginUser(loginUserDTO);

        assertNotNull(response);
        assertEquals("jwtToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("USER", response.getRole());
        assertEquals("User has logged in successfully", response.getMessage());

        verify(userRepository, times(1)).findByUsername(anyString());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateToken(any(Users.class));
        verify(jwtService, times(1)).generateRefreshToken(any(Users.class));
        verify(tokenRepository, times(1)).save(any(Token.class)); // Corrected!
    }


    @Test
    void testLoginUser_UserNotFound() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            authenticationService.loginUser(loginUserDTO);
        });

        verify(userRepository, times(1)).findByUsername(anyString());
        verify(authenticationManager, times(0)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(0)).generateToken(any(Users.class));
        verify(jwtService, times(0)).generateRefreshToken(any(Users.class));
        verify(tokenRepository, times(0)).saveAll(anyList());
    }

    @Test
    void testLoginUser_BadCredentials() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        doThrow(BadCredentialsException.class).when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(IllegalArgumentException.class, () -> {
            authenticationService.loginUser(loginUserDTO);
        });

        verify(userRepository, times(1)).findByUsername(anyString());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(0)).generateToken(any(Users.class));
        verify(jwtService, times(0)).generateRefreshToken(any(Users.class));
        verify(tokenRepository, times(0)).saveAll(anyList());
    }

    @Test
    void testRefreshToken_Success() throws IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        // Mock the OutputStream for HttpServletResponse
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        when(response.getOutputStream()).thenReturn(new ServletOutputStreamWrapper(outputStream));

        // Mock the behavior of the request and services
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer refreshToken");
        when(jwtService.extractUserName(anyString())).thenReturn("USR12345");

        // Ensure the user has a valid ID
        user.setId(1); // Set a valid ID for the user
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(jwtService.validateToken(anyString(), any(Users.class))).thenReturn(true);
        when(jwtService.generateToken(any(Users.class))).thenReturn("newJwtToken");

        // Mock the behavior of tokenRepository.findAllValidTokenByUser
        Token token = Token.builder()
                .id(1L)
                .token("oldToken")
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .users(user)
                .build();
        when(tokenRepository.findAllValidTokenByUser(user.getId())).thenReturn(List.of(token));

        // Call the method under test
        authenticationService.refreshToken(request, response);

        // Verify interactions
        verify(request, times(1)).getHeader(HttpHeaders.AUTHORIZATION);
        verify(jwtService, times(1)).extractUserName(anyString());
        verify(userRepository, times(1)).findByUsername(anyString());
        verify(jwtService, times(1)).validateToken(anyString(), any(Users.class));
        verify(jwtService, times(1)).generateToken(any(Users.class));
        verify(tokenRepository, times(1)).findAllValidTokenByUser(user.getId()); // Verify with the correct user ID
        verify(tokenRepository, times(1)).save(any(Token.class)); // Verify save() instead of saveAll()
        verify(response, times(1)).getOutputStream();

        // Verify the response content
        String responseContent = outputStream.toString();
        assertNotNull(responseContent);
        assertTrue(responseContent.contains("newJwtToken"));
    }

    @Test
    void testRefreshToken_InvalidToken() throws IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("InvalidToken");

        authenticationService.refreshToken(request, response);

        verify(request, times(1)).getHeader(HttpHeaders.AUTHORIZATION);
        verify(jwtService, times(0)).extractUserName(anyString());
        verify(userRepository, times(0)).findByUsername(anyString());
        verify(jwtService, times(0)).validateToken(anyString(), any(Users.class));
        verify(jwtService, times(0)).generateToken(any(Users.class));
        verify(tokenRepository, times(0)).saveAll(anyList());
        verify(response, times(0)).getOutputStream();
    }
}