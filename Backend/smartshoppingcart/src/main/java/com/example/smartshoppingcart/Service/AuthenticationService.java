package com.example.smartshoppingcart.Service;
import com.example.smartshoppingcart.DTO.AuthenticationResponse;
import com.example.smartshoppingcart.DTO.LoginUserDTO;
import com.example.smartshoppingcart.DTO.RegisterUserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Service interface for handling authentication-related operations.
 */
public interface AuthenticationService {

    /**
     * Registers a new user in the application.
     *
     * @param registerUserDTO Data Transfer Object containing user registration details.
     * @return AuthenticationResponse containing the authentication details of the registered user.
     */
    AuthenticationResponse registerUser(RegisterUserDTO registerUserDTO);

    /**
     * Authenticates a user and logs them into the application.
     *
     * @param loginUserDTO Data Transfer Object containing user login details.
     * @return AuthenticationResponse containing the authentication details of the logged-in user.
     */
    AuthenticationResponse loginUser(LoginUserDTO loginUserDTO);

    /**
     * Refreshes the authentication token for a user.
     *
     * @param request  HttpServletRequest containing the request details.
     * @param response HttpServletResponse containing the response details.
     * @throws IOException if an input or output exception occurs.
     */
    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
}