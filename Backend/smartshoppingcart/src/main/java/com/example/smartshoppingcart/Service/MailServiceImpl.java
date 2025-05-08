package com.example.smartshoppingcart.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Implementation of the MailService interface for handling email operations.
 * <p>
 * This service is responsible for sending emails, including login details and password reset codes,
 * using the JavaMailSender.
 */
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService{

    // JavaMailSender instance for sending emails
    private final JavaMailSender mailSender;

    /**
     * Sends login details (username and password) to the specified email address.
     *
     * @param email    The recipient's email address.
     * @param username The username to include in the email.
     * @param password The password to include in the email.
     */
    @Override
    public void sendLoginDetails(String email, String username, String password) {
        String subject = "Login Details";
        String message = String.format(
                """
                        Greetings, Your username and password are:
                        Username: %s
                        Password: %s""",
                username, password
        );

        sendEmail(email, subject, message); // Use helper method to send email
    }

    /**
     * Sends a password reset code to the specified email address.
     *
     * @param email     The recipient's email address.
     * @param resetCode The password reset code to include in the email.
     */
    @Override
    public void sendResetCode(String email, String resetCode) {
        String subject = "Password Reset Code";
        String message = String.format(
                """
                        Dear User,

                        Your password reset code is: %s

                        This code will expire in 3 minutes.

                        Best regards,
                        Developer Team""",
                resetCode
        );

        sendEmail(email, subject, message); // Use helper method to send email
    }

    /**
     * Helper method to send an email using the specified parameters.
     *
     * @param email   The recipient's email address.
     * @param subject The subject of the email.
     * @param message The message body of the email.
     */
    private void sendEmail(String email, String subject, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(message);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
