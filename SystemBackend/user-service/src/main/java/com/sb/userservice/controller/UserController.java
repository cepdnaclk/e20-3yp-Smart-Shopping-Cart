package com.sb.userservice.controller;

import com.sb.userservice.dto.AuthenticationResponse;
import com.sb.userservice.dto.LoginUserDTO;
import com.sb.userservice.dto.RegisterUserDTO;
import com.sb.userservice.model.Role;
import com.sb.userservice.model.User;
import com.sb.userservice.repository.UserRepository;
import com.sb.userservice.service.JWTService;
import com.sb.userservice.service.UserService;
import com.sb.userservice.service.UserServiceImpl;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JWTService jwtService;
    private final UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService, JWTService jwtService, UserRepository userRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        try {
            AuthenticationResponse response = userService.loginUser(loginUserDTO);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            // Handle known errors, like bad credentials or user not found
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            // Log full stack trace for backend debugging
            logger.error("Error in loginUser endpoint", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error. Please try again later.");
        }
    }

    // POST /user/register
    @PostMapping("/profile/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterUserDTO registerUserDTO, Authentication authentication) {
        try {
            String response = userService.registerUser(registerUserDTO, authentication);
            // You can return a custom DTO for better API design, but a string is fine for now
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            // Known, expected errors (e.g., duplicate, bad input, unauthorized)
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            // Log the error details for backend debugging
            logger.error("Error in registerUser endpoint", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error. Please try again later.");
        }
    }

    @GetMapping("/profile/validate")
    public ResponseEntity<Void> validateToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().build();
            }

            String token = authHeader.substring(7);
            String username = jwtService.extractUserName(token);

            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            UserDetails user = userOptional.get();

            if (jwtService.validateToken(token, user)) {
                return ResponseEntity.ok().build(); // Token is valid
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception ex) {
            // Log the exception for debugging
            logger.error("Error in validateToken endpoint", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/profile/role")
    public ResponseEntity<?> getRole(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
            }
            String token = authHeader.substring(7);

            Role role = userService.getRoleFromToken(token);
            return ResponseEntity.ok(Map.of("role", role.name()));
        } catch (Exception e) {
            // Optional: logger.error("Error in getRole endpoint", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or user not found");
        }
    }

    // PUT /user/update
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateUser(@Valid @RequestBody RegisterUserDTO registerUserDTO, Authentication authentication) {
        try {
            String response = userService.updateUser(registerUserDTO, authentication);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            // For expected errors (e.g., invalid input)
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            // Optional: logger.error("Error in updateUser endpoint", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error. Please try again later.");
        }
    }

    // GET /user/get
    @GetMapping("/profile/get")
    public ResponseEntity<?> getUser(Authentication authentication) {
        try {
            RegisterUserDTO user = userService.getUser(authentication);
            if (user == null) {
                // User not found, could be unauthenticated or deleted
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(user);
        } catch (Exception ex) {
            // Optional: logger.error("Error in getUser endpoint", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error. Please try again later.");
        }
    }

    // DELETE /user/delete?username=...
    @DeleteMapping("/profile/delete")
    public ResponseEntity<?> deleteUser(@RequestParam @NotBlank String username, Authentication authentication) {
        try {
            String response = userService.deleteUser(username, authentication);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            // Known/expected error (e.g., user not found, unauthorized)
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            // Optional: logger.error("Error in deleteUser endpoint", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error. Please try again later.");
        }
    }


}
