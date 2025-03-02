package com.example.smartshoppingcart.Service;
import com.example.smartshoppingcart.DTO.ChangePasswordRequestDTO;
import com.example.smartshoppingcart.Model.ResetCode;
import com.example.smartshoppingcart.Model.Users;
import com.example.smartshoppingcart.Repository.ResetCodeRepository;
import com.example.smartshoppingcart.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

/**
 * Service implementation for managing user-related operations.
 * <p>
 * This service handles operations such as password changes, password resets, and email-based authentication.
 * <p>
 * Optimized for scenarios where the majority of requests are likely from students.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    // Dependencies injected via constructor
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ResetCodeRepository resetCodeRepository;
    private final MailService mailService;

    /**
     * Changes the user's password after validating the current password.
     *
     * @param request        DTO containing the current password, new password, and confirmation password.
     * @param connectedUser  The current authenticated user (via Principal).
     */
    @Override
    @Transactional
    public void changePassword(ChangePasswordRequestDTO request, Principal connectedUser) {
        String username = connectedUser.getName(); // Get username from Principal


        // Check the User entity if the student entity is not found
        Optional<Users> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            validateAndChangePassword(user.getPassword(), request.getCurrentPassword(), request.getNewPassword(), request.getConfirmationPassword());
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return; // Successfully updated the password for a user
        }

        // If the user is not found in either entity, throw an exception
        throw new IllegalStateException("User not found");
    }

    /**
     * Helper method to validate the current password, new password, and confirmation password.
     *
     * @param existingPassword    The current hashed password stored in the database.
     * @param currentPassword     The current password provided by the user.
     * @param newPassword         The new password provided by the user.
     * @param confirmationPassword The confirmation of the new password.
     */
    private void validateAndChangePassword(String existingPassword, String currentPassword, String newPassword, String confirmationPassword) {
        // Validate the current password
        if (!passwordEncoder.matches(currentPassword, existingPassword)) {
            throw new IllegalStateException("Wrong current password");
        }

        // Validate the new password and confirmation match
        if (!newPassword.equals(confirmationPassword)) {
            throw new IllegalStateException("Passwords do not match");
        }

        // Validate password strength
        if (isValidPassword(newPassword)) {
            throw new IllegalStateException(
                    "New password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."
            );
        }
    }

    /**
     * Handles the process of initiating a password reset by generating and sending a reset code.
     *
     * @param username The username of the user requesting a password reset.
     * @param email    The email address of the user requesting a password reset.
     */
    @Override
    @Transactional
    public void forgetPassword(String username, String email) {

        // Check the User entity if not found in Student
        Optional<Users> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();

            // Validate the email matches
            if (!user.getEmail().equals(email)) {
                throw new IllegalArgumentException("The provided email does not match the username");
            }

            // Process reset code
            processResetCode(email);
            return; // Exit after handling the user entity
        }

        // If the username is not found in both entities, throw an exception
        throw new IllegalArgumentException("Invalid username or email");
    }

    /**
     * Resets the user's password using a valid reset code.
     *
     * @param email   The email address associated with the reset code.
     * @param code    The reset code provided by the user.
     * @param request DTO containing the new password and confirmation password.
     */
    @Override
    @Transactional
    public void resetPasswordWithCode(String email, String code, ChangePasswordRequestDTO request) {

        // Validate the reset code
        var resetCode = resetCodeRepository.findByEmailAndResetCode(email, code)
                .orElseThrow(() -> new IllegalStateException("Invalid or expired reset code"));

        // Check if the reset code is expired
        if (resetCode.isExpired() || resetCode.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Reset code is expired");
        }

        // Validate the new password and confirmation match
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Passwords do not match");
        }

        // Validate password strength
        if (isValidPassword(request.getNewPassword())) {
            throw new IllegalStateException(
                    "New password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."
            );
        }

        // Update the password for the User entity if the student entity is not found
        Optional<Users> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            resetCodeRepository.deleteByEmail(email); // Clean up reset codes
            return;
        }

        // If the email is not found in either entity, throw an exception
        throw new IllegalStateException("User not found");
    }

    /**
     * Deletes a user or student based on their username and role.
     * <p>
     * This method first checks if the user exists in the `Students` table (as most cases involve students),
     * and deletes the user if found. If not found in the `Students` table, it checks the `Users` table.
     *
     * @param username The username of the user to be deleted.
     * @param role     The role of the user (e.g., STUDENT, TEACHER, ADMIN).
     * @throws IllegalArgumentException If the user does not exist in the corresponding table.
     */
    @Override
    @Transactional // Ensures database consistency
    public void deleteUser(String username, String role) {

            // Search for the user in the `Users` table
            var optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isPresent()) {
                userRepository.delete(optionalUser.get());
                return; // Successfully deleted the user
            }

        // Throw an exception if the user is not found in either table
        throw new IllegalArgumentException("User with username " + username + " and role " + role + " does not exist.");
    }

    /**
     * Validates if the provided password meets the security requirements.
     *
     * @param password The password to validate.
     * @return True if the password is invalid, false otherwise.
     */
    private boolean isValidPassword(String password) {
        String passwordPattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,}$";
        return !password.matches(passwordPattern);
    }

    /**
     * Helper method to generate, save, and send a reset code to the user's email.
     *
     * @param email The email address to send the reset code to.
     */
    private void processResetCode(String email) {
        // Expire all existing reset codes for this email
        var existingCodes = resetCodeRepository.findByEmail(email);
        for (ResetCode code : existingCodes) {
            code.setExpired(true);
        }
        resetCodeRepository.saveAll(existingCodes);

        // Generate a new reset code
        String resetCode = String.format("%06d", new Random().nextInt(999999));

        // Set expiration time (3 minutes from now)
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(3);

        // Save the new reset code to the database
        ResetCode codeEntity = new ResetCode();
        codeEntity.setEmail(email);
        codeEntity.setResetCode(resetCode);
        codeEntity.setExpirationTime(expirationTime);
        resetCodeRepository.save(codeEntity);

        // Send the reset code via email
        mailService.sendResetCode(email, resetCode);
    }
}

