package com.example.smartshoppingcart.DTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) for handling reset password requests.
 * <p>
 * This DTO encapsulates the fields required for resetting a user's password,
 * including the user's email, reset code, and details for the new password.
 */
@Getter
@Setter
@Builder
public class ResetPasswordRequestDTO {

    /**
     * The email address associated with the user's account.
     * <p>
     * This field identifies the user requesting the password reset.
     * <p>
     * Example: "user@example.com"
     */
    private String email;

    /**
     * The reset code sent to the user's email address for verification.
     * <p>
     * This field ensures that only the user with access to the registered email can reset the password.
     * <p>
     * Example: "123456"
     */
    private String resetCode;

    /**
     * A nested DTO containing the details for the new password.
     * <p>
     * This includes the new password and its confirmation, ensuring the user enters a valid and consistent password.
     */
    private ChangePasswordRequestDTO changePasswordRequestDTO;
}
