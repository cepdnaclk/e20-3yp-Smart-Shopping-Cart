package com.sb.customerservice.controller;

import com.sb.customerservice.dto.AuthenticationResponse;
import com.sb.customerservice.dto.LoginUserDTO;
import com.sb.customerservice.dto.RegisterCustomerDTO;
import com.sb.customerservice.model.Customer;
import com.sb.customerservice.model.Role;
import com.sb.customerservice.repository.CustomerRepository;
import com.sb.customerservice.service.CustomerService;
import com.sb.customerservice.service.JWTService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService customerService;
    private final JWTService jWTService;
    private final CustomerRepository customerRepository;

    public CustomerController(CustomerService customerService, JWTService jWTService, CustomerRepository customerRepository) {
        this.customerService = customerService;
        this.jWTService = jWTService;
        this.customerRepository = customerRepository;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthenticationResponse> loginCustomer(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        AuthenticationResponse response = customerService.loginCustomer(loginUserDTO);
        return ResponseEntity.ok(response);
    }

    // POST /customer/register
    @PostMapping("/auth/register")
    public ResponseEntity<String> registerCustomer(@Valid @RequestBody RegisterCustomerDTO registerCustomerDTO) {
        try {
            String response = customerService.registerCustomer(registerCustomerDTO);
            return ResponseEntity.ok(response); // ✅ e.g., "Registration successful. Email sent!"
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage()); // 🛑 This message will be shown as toast
        }
    }

    @GetMapping("/profile/validate")
    public ResponseEntity<Void> validateToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String token = authHeader.substring(7);
        String username = jWTService.extractUserName(token);

        Optional<Customer> customerOptional = customerRepository.findByUsername(username);
        if(customerOptional.isEmpty()){
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        UserDetails customer = customerOptional.get();

        if (jWTService.validateToken(token, customer)) {
            return ResponseEntity.ok().build(); // Token is valid
        } else {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }

    @GetMapping("/profile/role")
    public ResponseEntity<?> getRole(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        try {
            Role role = customerService.getRoleFromToken(token);
            return ResponseEntity.ok().body(Map.of("role", role.name()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token or Customer not found");
        }
    }

    // PUT /customer/update
    @PutMapping("/profile/update")
    public ResponseEntity<String> updateCustomer(@Valid @RequestBody RegisterCustomerDTO registerCustomerDTO, Authentication authentication) {
        String response = customerService.updateCustomer(registerCustomerDTO, authentication);
        return ResponseEntity.ok(response);
    }

    // GET /customer/get
    @GetMapping("/profile/get")
    public ResponseEntity<RegisterCustomerDTO> getCustomer(Authentication authentication) {
        RegisterCustomerDTO customer = customerService.getCustomer(authentication);
        return ResponseEntity.ok(customer);
    }

    // DELETE /customer/delete?username=...
    @DeleteMapping("/profile/delete")
    public ResponseEntity<String> deleteCustomer(@RequestParam @NotBlank String username) {
        String response = customerService.deleteCustomer(username);
        return ResponseEntity.ok(response);
    }
}
