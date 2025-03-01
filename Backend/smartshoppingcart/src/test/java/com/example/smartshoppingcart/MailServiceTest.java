package com.example.smartshoppingcart;

import com.example.smartshoppingcart.Service.MailServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MailServiceTest {

    @Mock
    private JavaMailSender mailSender; // Mock JavaMailSender

    @InjectMocks
    private MailServiceImpl mailService; // Inject the mock into MailServiceImpl

    private MimeMessage mimeMessage;

    @BeforeEach
    void setup() {
        mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    /**
     * Test sending login details email.
     */
    @Test
    void testSendLoginDetails() throws MessagingException {
        String email = "testuser@example.com";
        String username = "USR12345";
        String password = "Pass@123";

        // Call the method
        mailService.sendLoginDetails(email, username, password);

        // Verify that the email was sent
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    /**
     * Test sending password reset code email.
     */
    @Test
    void testSendResetCode() throws MessagingException {
        String email = "reset@example.com";
        String resetCode = "123456";

        // Call the method
        mailService.sendResetCode(email, resetCode);

        // Verify that the email was sent
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    /**
     * Test failure scenario where sending email throws an exception.
     */
    @Test
    void testSendEmailFailure() throws MessagingException {
        String email = "error@example.com";
        String subject = "Test Subject";
        String message = "Test Message";

        // Simulate an error in sending
        doThrow(new RuntimeException("Email sending failed")).when(mailSender).send(any(MimeMessage.class));

        try {
            mailService.sendLoginDetails(email, "USR00001", "TestPass123");
        } catch (RuntimeException e) {
            // Expected exception
        }

        // Verify that send method was attempted once
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }
}
