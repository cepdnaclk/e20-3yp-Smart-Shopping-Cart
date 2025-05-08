package com.example.smartshoppingcart.Controller;

import com.example.smartshoppingcart.DTO.AuthenticationResponse;
import com.example.smartshoppingcart.DTO.LoginUserDTO;
import com.example.smartshoppingcart.DTO.RegisterUserDTO;
import com.example.smartshoppingcart.Repository.UserRepository;
import com.example.smartshoppingcart.Service.AuthenticationService;
import com.example.smartshoppingcart.Service.AuthenticationServiceImpl;
import com.example.smartshoppingcart.Service.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;

/**
 * Controller for handling authentication and user management operations.
 * <p>
 * This controller provides endpoints for:
 * 1. User and student registration.
 * 2. Login operations.
 * 3. Refreshing access tokens using refresh tokens.
 * <p>
 * Uses {@link AuthenticationService} to delegate business logic and token management.
 * Includes appropriate exception handling for conflicts, unauthorized access, and user-not-found scenarios.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final JWTService jwtService;
    private final UserRepository userRepository;

    /**
     * Endpoint for registering a new user or student.
     * <p>
     * Validates the input DTO and delegates the registration process to the {@link AuthenticationService}.
     * Handles conflicts if the user or student already exists in the system.
     *
     * @param registerUserDTO The DTO containing user registration details.
     * @return A {@link ResponseEntity} containing the authentication response or an error message.
     * <p>
     * Example:
     * POST /api/v1/auth/register
     * Request Body:
     * {
     *   "username": "newuser",
     *   "password": "password123",
     *   "email": "newuser@example.com"
     * }
     * Response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "message": "User registered successfully"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerUser(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        try {
            // Call the service method directly, as it will handle token extraction internally
            return ResponseEntity.ok(authenticationService.registerUser(registerUserDTO));
        } catch (AuthenticationServiceImpl.UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(AuthenticationResponse.builder().message(e.getMessage()).build());
        }
    }

    /**
     * Endpoint for logging in a user or student.
     * <p>
     * Validates the input DTO and delegates the login process to the {@link AuthenticationService}.
     * Handles scenarios where the user is not found or the password does not match.
     *
     * @param loginUserDTO The DTO containing login credentials.
     * @return A {@link ResponseEntity} containing the authentication response or an error message.
     * <p>
     * Example:
     * POST /api/v1/auth/login
     * Request Body:
     * {
     *   "username": "existinguser",
     *   "password": "password123"
     * }
     * Response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "message": "Login successful"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginUser(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        try {
            AuthenticationResponse response = authenticationService.loginUser(loginUserDTO);
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(AuthenticationResponse.builder()
                            .message("User does not exist")
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthenticationResponse.builder()
                            .message("Password Mismatch")
                            .build());
        }
    }

    /**
     * Endpoint for refreshing the user's access token using a valid refresh token.
     * <p>
     * Delegates the token refresh process to the {@link AuthenticationService}.
     *
     * @param request  The HTTP request containing the refresh token in the Authorization header.
     * @param response The HTTP response where the new access token is written.
     * @throws IOException If an error occurs while writing the response.
     * <p>
     * Example:
     * POST /api/v1/auth/refresh-token
     * Header:
     * Authorization: Bearer <refresh_token>
     * Response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     * }
     */
    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authenticationService.refreshToken(request, response);
    }

}
