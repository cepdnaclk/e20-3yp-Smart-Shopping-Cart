package com.sb.customerservice.service;
import com.sb.customerservice.dto.AuthenticationResponse;
import com.sb.customerservice.dto.LoginUserDTO;
import com.sb.customerservice.dto.RegisterCustomerDTO;
import com.sb.customerservice.model.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

import java.io.IOException;

public interface CustomerService {

    String registerCustomer(RegisterCustomerDTO registerCustomerDTO);

    String updateCustomer(RegisterCustomerDTO registerCustomerDTO, Authentication authentication);

    RegisterCustomerDTO getCustomer(Authentication authentication);

    String deleteCustomer(String username);

    AuthenticationResponse loginCustomer(LoginUserDTO loginUserDTO);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;

    Role getRoleFromToken(String jwtToken);

}
