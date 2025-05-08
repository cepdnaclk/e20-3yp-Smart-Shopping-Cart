package com.example.smartshoppingcart.DTO;
import com.example.smartshoppingcart.Model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data transfer object representing a user registration request.
 * Contains fields required for registering a new user account.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserDTO {

    /**
     * The email address of the user.
     * <p>
     * Example: "user@example.com"
     */
    @Email
    @NotNull
    private String email;

    /**
     * The password of the user.
     * <p>
     * Must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.
     * <p>
     * Example: "SecurePass123!"
     */
    @NotNull
    @Size(min = 8, max = 100)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.")
    private String password;

    /**
     * The first name of the user.
     * <p>
     * Example: "John"
     */
    @NotNull
    @Size(min = 1, max = 50)
    private String firstName;

    /**
     * The last name of the user.
     * <p>
     * Example: "Doe"
     */
    @NotNull
    @Size(min = 1, max = 50)
    private String lastName;

    /**
     * The National Identity Card (NIC) number of the user.
     * <p>
     * Example: "123456789V"
     */
    @NotNull
    @Size(min = 10, max = 12)
    private String nic;

    /**
     * The phone number of the user.
     * <p>
     * Example: "+1234567890"
     */
    @NotNull
    private String phone;

    /**
     * The role of the user.
     * <p>
     * Example: Role.USER
     */
    @NotNull
    private Role role;
}
