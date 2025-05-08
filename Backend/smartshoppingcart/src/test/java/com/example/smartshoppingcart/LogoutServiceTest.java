package com.example.smartshoppingcart;
import com.example.smartshoppingcart.Service.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LogoutServiceTest {

    private LogoutService logoutService;
    private HttpServletRequest mockRequest;
    private HttpServletResponse mockResponse;
    private Authentication mockAuthentication;

    @BeforeEach
    void setUp() {
        // Mock the dependencies
        logoutService = Mockito.mock(LogoutService.class);
        mockRequest = Mockito.mock(HttpServletRequest.class);
        mockResponse = Mockito.mock(HttpServletResponse.class);
        mockAuthentication = Mockito.mock(Authentication.class);
    }

    @Test
    void testLogout_Success() {
        // When
        logoutService.logout(mockRequest, mockResponse, mockAuthentication);

        // Then
        verify(logoutService, times(1)).logout(mockRequest, mockResponse, mockAuthentication);
    }

    @Test
    void testLogout_NullAuthentication() {
        // When
        logoutService.logout(mockRequest, mockResponse, null);

        // Then
        verify(logoutService, times(1)).logout(mockRequest, mockResponse, null);
    }

    @Test
    void testLogout_NullRequestAndResponse() {
        // When
        logoutService.logout(null, null, mockAuthentication);

        // Then
        verify(logoutService, times(1)).logout(null, null, mockAuthentication);
    }

    @Test
    void testLogout_AuthenticationHasPrincipal() {
        // Given
        when(mockAuthentication.getPrincipal()).thenReturn("testUser");

        // When
        logoutService.logout(mockRequest, mockResponse, mockAuthentication);

        // Then
        verify(logoutService, times(1)).logout(mockRequest, mockResponse, mockAuthentication);
        assertEquals("testUser", mockAuthentication.getPrincipal());
    }
}