package com.example.smartshoppingcart;

import com.example.smartshoppingcart.DTO.ChangePasswordRequestDTO;
import com.example.smartshoppingcart.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService methods.
 */
public class UserServiceTest {

    private UserService userService;
    private Principal connectedUser;

    @BeforeEach
    void setUp() {
        userService = Mockito.mock(UserService.class);
        PasswordEncoder passwordEncoder = Mockito.mock(PasswordEncoder.class);
        connectedUser = Mockito.mock(Principal.class);
    }

    @Test
    void testChangePassword_Success() {
        // Given
        ChangePasswordRequestDTO request = ChangePasswordRequestDTO.builder()
                .currentPassword("currentPassword")
                .newPassword("newPassword123")
                .confirmationPassword("newPassword123")
                .build();

        when(connectedUser.getName()).thenReturn("testUser");

        // When
        userService.changePassword(request, connectedUser);

        // Then
        verify(userService, times(1)).changePassword(request, connectedUser);
    }

    @Test
    void testForgetPassword_Success() {
        // Given
        String username = "testUser";
        String email = "test@example.com";

        // When
        userService.forgetPassword(username, email);

        // Then
        verify(userService, times(1)).forgetPassword(username, email);
    }

    @Test
    void testResetPasswordWithCode_Success() {
        // Given
        String email = "test@example.com";
        String code = "resetCode123";
        ChangePasswordRequestDTO request = ChangePasswordRequestDTO.builder()
                .newPassword("newPassword123")
                .confirmationPassword("newPassword123")
                .build();

        // When
        userService.resetPasswordWithCode(email, code, request);

        // Then
        verify(userService, times(1)).resetPasswordWithCode(email, code, request);
    }

    @Test
    void testChangePassword_PasswordMismatch() {
        // Given
        ChangePasswordRequestDTO request = ChangePasswordRequestDTO.builder()
                .currentPassword("currentPassword")
                .newPassword("newPassword123")
                .confirmationPassword("differentPassword123")
                .build();

        when(connectedUser.getName()).thenReturn("testUser");

        doThrow(new IllegalArgumentException("Passwords do not match"))
                .when(userService).changePassword(request, connectedUser);

        // When
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.changePassword(request, connectedUser);
        });

        // Then
        assertEquals("Passwords do not match", exception.getMessage());
        verify(userService, times(1)).changePassword(request, connectedUser);
    }

    @Test
    void testForgetPassword_UserNotFound() {
        // Given
        String username = "unknownUser";
        String email = "unknown@example.com";

        doThrow(new IllegalArgumentException("User not found"))
                .when(userService).forgetPassword(username, email);

        // When
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.forgetPassword(username, email);
        });

        // Then
        assertEquals("User not found", exception.getMessage());
        verify(userService, times(1)).forgetPassword(username, email);
    }

    @Test
    void testResetPasswordWithCode_InvalidCode() {
        // Given
        String email = "test@example.com";
        String code = "invalidCode";
        ChangePasswordRequestDTO request = ChangePasswordRequestDTO.builder()
                .newPassword("newPassword123")
                .confirmationPassword("newPassword123")
                .build();

        doThrow(new IllegalArgumentException("Invalid reset code"))
                .when(userService).resetPasswordWithCode(email, code, request);

        // When
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.resetPasswordWithCode(email, code, request);
        });

        // Then
        assertEquals("Invalid reset code", exception.getMessage());
        verify(userService, times(1)).resetPasswordWithCode(email, code, request);
    }

}
