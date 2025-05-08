package com.example.smartshoppingcart.Controller;
import com.example.smartshoppingcart.DTO.ChangePasswordRequestDTO;
import com.example.smartshoppingcart.DTO.ForgetPasswordRequestDTO;
import com.example.smartshoppingcart.DTO.ResetPasswordRequestDTO;
import com.example.smartshoppingcart.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

/**
 * REST Controller for handling user-related operations.
 * <p>
 * Provides endpoints for managing user passwords, including changing, forgetting, and resetting passwords.
 * Integrates with the UserService for business logic execution.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Endpoint to change the password of the connected user.
     * <p>
     * 1. Accepts a ChangePasswordRequestDTO containing the old and new passwords.
     * 2. Uses the `Principal` to identify the connected user.
     * 3. Delegates the password change operation to the UserService.
     *
     * @param request       DTO containing the old and new passwords.
     * @param connectedUser The currently authenticated user.
     * @return A ResponseEntity indicating the result of the operation.
     */
    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequestDTO request,
            Principal connectedUser
    ) {
        userService.changePassword(request, connectedUser);
        return ResponseEntity.accepted().build();
    }

    /**
     * Endpoint to initiate the password recovery process.
     * <p>
     * 1. Accepts a request containing the username and email.
     * 2. Validates that both fields are provided.
     * 3. Sends a reset code to the user's email if the provided details are valid.
     * 4. Returns an appropriate response indicating success or failure.
     *
     * @param request A {@link ForgetPasswordRequestDTO} containing the username and email fields.
     * @return A {@link ResponseEntity} with a success or error message.
     */
    @PatchMapping("/forgetPassword")
    @Operation(summary = "Initiate password recovery",
            description = "Send a reset code to the user's email if the username and email match.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reset code sent to email"),
            @ApiResponse(responseCode = "400", description = "Bad request or invalid details")
    })
    public ResponseEntity<?> forgetPassword(@RequestBody @Valid ForgetPasswordRequestDTO request) {
        try {
            userService.forgetPassword(request.getUsername(), request.getEmail());
            return ResponseEntity.ok("Reset code sent to your email");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint to reset a user's password using a reset code.
     * <p>
     * 1. Accepts a ResetPasswordRequestDTO containing the email, reset code, and new password details.
     * 2. Validates that all required fields are present.
     * 3. Delegates the reset operation to the UserService.
     * 4. Returns a success message or an error message if the operation fails.
     *
     * @param request DTO containing the email, reset code, and new password details.
     * @return A ResponseEntity with a success or error message.
     */
    @PatchMapping("/resetPassword")
    public ResponseEntity<?> resetPasswordWithCode(@RequestBody ResetPasswordRequestDTO request) {
        // Validate that all required fields are present
        if (request.getEmail() == null || request.getResetCode() == null ||
                request.getChangePasswordRequestDTO() == null ||
                request.getChangePasswordRequestDTO().getNewPassword() == null ||
                request.getChangePasswordRequestDTO().getConfirmationPassword() == null) {
            return ResponseEntity.badRequest().body("Email, code, new password, and confirmation password are required");
        }

        try {
            // Call the service method
            userService.resetPasswordWithCode(request.getEmail(), request.getResetCode(), request.getChangePasswordRequestDTO());
            return ResponseEntity.ok("Password reset successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint to delete a user or student based on their username and role.
     * <p>
     * 1. Validates the provided `username` and `role` parameters.
     * 2. Delegates the deletion operation to the `UserService`.
     * 3. Returns a success message if the deletion is successful, or an error message otherwise.
     *
     * @param username The username of the user to be deleted.
     * @param role     The role of the user (e.g., STUDENT, TEACHER, ADMIN).
     * @return A ResponseEntity with a success or error message.
     */
    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(
            @RequestParam String username,
            @RequestParam String role
    ) {
        try {
            userService.deleteUser(username, role);
            return ResponseEntity.ok("User with username " + username + " and role " + role + " has been deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
