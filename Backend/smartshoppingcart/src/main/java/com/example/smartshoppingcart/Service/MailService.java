package com.example.smartshoppingcart.Service;

/**
 * Interface for managing email-related operations.
 * <p>
 * This interface defines methods for sending emails, such as login details
 * and password reset codes. Implementations are responsible for the actual
 * email-sending logic.
 */
public interface MailService {

    /**
     * Sends login details (username and password) to the specified email address.
     *
     * @param email    The recipient's email address.
     * @param username The username to include in the email.
     * @param password The password to include in the email.
     */
    void sendLoginDetails(String email, String username, String password);

    /**
     * Sends a password reset code to the specified email address.
     *
     * @param email     The recipient's email address.
     * @param resetCode The password reset code to include in the email.
     */
    void sendResetCode(String email, String resetCode);

}
