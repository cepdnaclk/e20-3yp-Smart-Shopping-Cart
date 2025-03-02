package com.example.smartshoppingcart.Service;

import com.example.smartshoppingcart.DTO.ChangePasswordRequestDTO;

import java.security.Principal;

/**
 * Interface for managing user-related operations.
 * <p>
 * This interface defines methods for handling password management tasks,
 * such as changing passwords, initiating password resets, and completing password resets.
 */
public interface UserService {

    /**
     * Changes the password of the currently authenticated user.
     * <p>
     * This method validates the current password, ensures the new password meets security requirements,
     * and updates the password in the database for either a User or Student entity.
     *
     * @param request        DTO containing the current password, new password, and confirmation password.
     * @param connectedUser  The current authenticated user (via Principal).
     */
    void changePassword(ChangePasswordRequestDTO request, Principal connectedUser);

    /**
     * Initiates a password reset process for the specified user.
     * <p>
     * This method validates the user's existence, generates a reset code, and sends it to the user's email.
     *
     * @param username The username of the user requesting a password reset.
     * @param email    The email address of the user requesting a password reset.
     */
    void forgetPassword(String username, String email);

    /**
     * Resets the password for a user using a valid reset code.
     * <p>
     * This method validates the reset code, ensures the new password meets security requirements,
     * and updates the password in the database for either a User or Student entity.
     *
     * @param email   The email address associated with the reset code.
     * @param code    The reset code provided by the user.
     * @param request DTO containing the new password and confirmation password.
     */
    void resetPasswordWithCode(String email, String code, ChangePasswordRequestDTO request);

    /**
     * Deletes a user or student based on their username and role.
     * <p>
     * This method checks if the user exists in the corresponding table (`Students` or `Users`)
     * based on the provided role and deletes the user from the database.
     *
     * @param username The username of the user to be deleted.
     * @param role     The role of the user (e.g., STUDENT, TEACHER, ADMIN).
     * @throws IllegalArgumentException If the user does not exist in the corresponding table.
     */
    void deleteUser(String username, String role);
}

