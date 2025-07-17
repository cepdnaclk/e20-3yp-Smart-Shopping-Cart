package com.sb.userservice.service;

import com.sb.userservice.dto.AuthenticationResponse;
import com.sb.userservice.dto.ChangePasswordRequestDTO;
import com.sb.userservice.dto.LoginUserDTO;
import com.sb.userservice.dto.RegisterUserDTO;
import com.sb.userservice.model.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

import java.io.IOException;

public interface UserService {

    String registerUser(RegisterUserDTO registerUserDTO, Authentication authentication);

    String updateUser(RegisterUserDTO registerUserDTO, Authentication authentication);

    RegisterUserDTO getUser(Authentication authentication);

    String deleteUser(String username, Authentication authentication);

    AuthenticationResponse loginUser(LoginUserDTO loginUserDTO);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;

    Role getRoleFromToken(String jwtToken);

    void changePassword(ChangePasswordRequestDTO request, Authentication authentication);

    void forgetPassword(String username, String email);

    void resetPasswordWithCode(String email, String code, ChangePasswordRequestDTO request);
}
