package com.example.smartshoppingcart.Service;
import com.example.smartshoppingcart.DTO.AuthenticationResponse;
import com.example.smartshoppingcart.DTO.LoginUserDTO;
import com.example.smartshoppingcart.DTO.RegisterUserDTO;
import com.example.smartshoppingcart.Model.Role;
import com.example.smartshoppingcart.Model.Token;
import com.example.smartshoppingcart.Model.TokenType;
import com.example.smartshoppingcart.Model.Users;
import com.example.smartshoppingcart.Repository.TokenRepository;
import com.example.smartshoppingcart.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * The AuthenticationServiceImpl class implements the AuthenticationService interface.
 * <p>
 * It provides methods for user registration, login, and token management.
 * The class uses the UserRepository and TokenRepository to interact with the database.
 * The PasswordEncoder is used to securely store and verify user passwords.
 * The JWTService is used to generate and validate JWT tokens.
 * The AuthenticationManager is used to authenticate users during login.
 * The MailService is used to send login details to users via email.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService{

    private final UserRepository userRepository; // User repository
    private final TokenRepository tokenRepository; // Token repository
    private final PasswordEncoder passwordEncoder; // Password encoder
    private final JWTService jwtService; // JWT service
    private final AuthenticationManager authenticationManager; // Authentication manager
    private final MailService mailService; // Mail service

    /**
     * Custom exception to indicate that the user already exists.
     */
    public static class UserAlreadyExistsException extends RuntimeException {
        public UserAlreadyExistsException(String message) {
            super(message);
        }
    }

    /**
     * Handles user registration and token generation.
     * <p>
     * 1. Checks if the user already exists by email or NIC.
     * 2. Checks if the Admin and Manager limits are reached.
     * 3. Generates a unique username based on the role.
     * 4. Generates a random, secure password for the user.
     * 5. Creates and saves the User entity in the database.
     * 6. Generates tokens for the user and saves them in the database.
     * 7. Sends the login details via email.
     * 8. Returns the authentication response containing the access token, refresh token, role, and message.
     * <p>
     * Uses @Transactional to ensure rollback on failure.
     *
     * @param registerUserDTO The user details to be registered.
     * @return AuthenticationResponse containing the access token, refresh token, role, and message.
     * @throws UserAlreadyExistsException If the user already exists.
     * @throws IllegalArgumentException     If the Admin or Manager limits are reached.
     */
    @Override
    @Transactional
    public AuthenticationResponse registerUser(RegisterUserDTO registerUserDTO) {
        // Check if user already exists by email or NIC
        if (userRepository.findByEmail(registerUserDTO.getEmail()).isPresent() ||
                userRepository.findByNic(registerUserDTO.getNic()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists");
        }

        Role role = registerUserDTO.getRole();

        // Check if Admin and Manager limits are reached
        if (role == Role.ADMIN && userRepository.countByRole(Role.ADMIN) >= 1) {
            throw new IllegalArgumentException("Only one admin is allowed.");
        }
        if (role == Role.MANAGER && userRepository.countByRole(Role.MANAGER) >= 2) {
            throw new IllegalArgumentException("Only two managers are allowed.");
        }

        // Generate unique username
        String username = generateUniqueUsername(role);
        String password = generatePassword();

        // Create and save the User entity
        var user = Users.builder()
                .username(username)
                .firstName(registerUserDTO.getFirstName())
                .lastName(registerUserDTO.getLastName())
                .email(registerUserDTO.getEmail())
                .password(passwordEncoder.encode(password))
                .phone(registerUserDTO.getPhone())
                .nic(registerUserDTO.getNic())
                .role(role)
                .build();

        var savedUser = userRepository.save(user);

        // Generate tokens for the user
        String jwtToken = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUserToken(savedUser, jwtToken);

        // Send login details via email
        mailService.sendLoginDetails(registerUserDTO.getEmail(), username, password);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .message("User Registered Successfully and Email Sent")
                .role(String.valueOf(registerUserDTO.getRole()))
                .build();
    }

    /**
     * Generates a unique username based on role.
     * If the username already exists, it generates a new one until it finds a unique username.
     *
     * @param role The role of the user.
     * @return A unique username.
     */
    private String generateUniqueUsername(Role role) {
        Random random = new Random();
        String username;

        do {
            if (role == Role.USER) {
                username = "USR" + String.format("%05d", random.nextInt(100000));
            } else if (role == Role.ADMIN) {
                username = "ADMIN" + String.format("%02d", random.nextInt(100));
            } else if (role == Role.MANAGER) {
                username = "MGT" + String.format("%04d", random.nextInt(10000));
            } else {
                throw new IllegalArgumentException("Unsupported role: " + role);
            }
        } while (userRepository.findByUsername(username).isPresent());

        return username;
    }

    /**
     * Generates a random, secure password following the system's complexity requirements.
     * <p>
     * The password includes:
     * 1. At least one uppercase letter.
     * 2. At least one lowercase letter.
     * 3. At least one digit.
     * 4. At least one special character.
     * <p>
     * The total length of the password is 8 characters.
     *
     * @return A randomly generated password string.
     */
    private String generatePassword() {
        String upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseLetters = "abcdefghjkmnpqrstuvwxyz";
        String digits = "123456789";
        String specialCharacters = "@#$%&";

        String allCharacters = upperCaseLetters + lowerCaseLetters + digits + specialCharacters;
        StringBuilder password = new StringBuilder(8);

        // Ensure the password includes at least one character from each category
        password.append(upperCaseLetters.charAt(ThreadLocalRandom.current().nextInt(upperCaseLetters.length())));
        password.append(lowerCaseLetters.charAt(ThreadLocalRandom.current().nextInt(lowerCaseLetters.length())));
        password.append(digits.charAt(ThreadLocalRandom.current().nextInt(digits.length())));
        password.append(specialCharacters.charAt(ThreadLocalRandom.current().nextInt(specialCharacters.length())));

        // Fill the remaining characters randomly from all categories
        for (int i = 4; i < 8; i++) {
            password.append(allCharacters.charAt(ThreadLocalRandom.current().nextInt(allCharacters.length())));
        }

        return password.toString();
    }

    /**
     * Handles user login and token generation.
     * <p>
     * The method prioritizes student login requests, as most users are expected to be students.
     * <p>
     * 1. Checks the StudentRepository first, followed by the UserRepository.
     * 2. Authenticates the user and generates both JWT and refresh tokens.
     * 3. Revokes old tokens and saves the new tokens in the database.
     * 4. Uses @Transactional to ensure rollback on failure.
     *
     * @param loginUserDTO The login details (username and password).
     * @return AuthenticationResponse containing the access token, refresh token, role, and message.
     * @throws UsernameNotFoundException If the user is not found.
     * @throws IllegalArgumentException If authentication fails due to incorrect credentials.
     */
    @Override
    @Transactional // Ensures rollback on failure
    public AuthenticationResponse loginUser(LoginUserDTO loginUserDTO) {
        Users user;
        String role;

            // Fallback to User repository
            var optionalUser = userRepository.findByUsername(loginUserDTO.getUsername());
            if (optionalUser.isPresent()) {
                user = optionalUser.get();
                role = user.getRole().name();
            } else {
                // If user is not found in either repository
                throw new UsernameNotFoundException("User does not exist");
            }

        // Authenticate the user
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginUserDTO.getUsername(),
                            loginUserDTO.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Password Mismatch");
        }

        // Generate JWT and refresh tokens
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        // Revoke existing tokens and save the new ones
            Users actualUser = user;
            revokeAllUserTokens(actualUser); // Revoke old tokens
            saveUserToken(actualUser, jwtToken); // Save new token


        // Return the authentication response
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(role)
                .message("User has logged in successfully")
                .build();
    }

    /**
     * Refreshes the user's access token using a valid refresh token.
     * <p>
     * 1. Validates the Authorization header and extracts the refresh token.
     * 2. Extracts the username from the refresh token and retrieves the user or student details.
     * 3. Validates the refresh token and generates a new access token if the validation succeeds.
     * 4. Revokes all existing valid tokens for the user or student and saves the new token.
     * 5. Writes the authentication response containing the new access token and the same refresh token.
     * <p>
     * Branch prediction is applied by prioritizing students during the user retrieval step, as most requests are expected from students.
     *
     * @param request  The HTTP request containing the Authorization header with the refresh token.
     * @param response The HTTP response where the new access token is written.
     * @throws IOException If an error occurs while writing the response.
     */
    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String username;

        // Validate the authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }

        // Extract the token and username from the header
        refreshToken = authHeader.substring(7);
        username = jwtService.extractUserName(refreshToken);

        if (username != null) {
            Users userDetails = null;

                // Fallback to User repository if not found in Student repository
                var userOptional = userRepository.findByUsername(username);
                if (userOptional.isPresent()) {
                    userDetails = userOptional.get();
                }

            // Validate the token and generate a new access token if valid
            if (userDetails != null && jwtService.validateToken(refreshToken, userDetails)) {
                // Generate a new access token
                var newAccessToken = jwtService.generateToken(userDetails);

                    revokeAllUserTokens(userDetails);
                    saveUserToken(userDetails, newAccessToken);

                // Create the authentication response
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .build();

                // Write the response to the output stream
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    /**
     * Revokes all valid tokens associated with the specified user.
     * <p>
     * Marks all active tokens associated with the user as expired and revoked.
     *
     * @param user The user whose tokens should be revoked.
     */
    private void revokeAllUserTokens(Users user) {
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

    /**
     * Saves a new token for the specified user.
     * <p>
     * Associates the provided JWT token with the user and saves it in the database.
     *
     * @param user     The user for whom the token is being saved.
     * @param jwtToken The token to be saved.
     */
    private void saveUserToken(Users user, String jwtToken) {
        var token = Token.builder()
                .users(user) // Associate the token with the user
                .token(jwtToken) // Set the JWT token string
                .tokenType(TokenType.BEARER) // Set the token type
                .revoked(false) // Mark the token as not revoked
                .expired(false) // Mark the token as not expired
                .build();
        tokenRepository.save(token); // Save the token to the database
    }

}
