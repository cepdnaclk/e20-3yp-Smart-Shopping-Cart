package com.sb.emailservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    public MailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

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

    private void sendEmail(String email, String subject, String message) {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(message, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Handle exception (e.g., log it)
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
