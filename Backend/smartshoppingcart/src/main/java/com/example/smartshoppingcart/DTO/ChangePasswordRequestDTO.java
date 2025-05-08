package com.example.smartshoppingcart.DTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) for handling change password requests.
 * <p>
 * This DTO encapsulates the necessary fields required for validating and processing
 * a password change operation, including the current password, new password, and confirmation password.
 */
@Getter
@Setter
@Builder
public class ChangePasswordRequestDTO {

    /**
     * The current password of the user.
     * <p>
     * This field is used to validate that the user knows their existing password
     * before allowing them to change it.
     * <p>
     * Example: "currentPassword123"
     */
    private String currentPassword;

    /**
     * The new password that the user wants to set.
     * <p>
     * This field is subject to password strength validation to ensure it meets
     * the application's security requirements.
     * <p>
     * Example: "newSecurePassword456"
     */
    private String newPassword;

    /**
     * The confirmation of the new password.
     * <p>
     * This field ensures that the user has entered the new password correctly
     * by requiring them to type it twice.
     * <p>
     * Example: "newSecurePassword456"
     */
    private String confirmationPassword;

}
