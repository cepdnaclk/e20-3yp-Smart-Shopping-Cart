package com.sb.userservice.config;

import com.sb.userservice.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {

    private final UserRepository userRepository;

    public ApplicationConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Configures a custom UserDetailsService that retrieves user details by either username, email, or NIC.
     * Optimized for scenarios where students are the majority of returned entities.
     *
     * @return Optimized UserDetailsService implementation for authentication.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return identifier -> {
            // First attempt to find the customer by username or NIC (branch prediction: majority are customers)
            var user = userRepository.findByUsername(identifier)
                    .or(() -> userRepository.findByNic(identifier));
            if (user.isPresent()) {
                return user.get();
            }

            // If no matching customer is found, throw exception
            throw new UsernameNotFoundException("Customer not found");
        };
    }

    /**
     * Configures the AuthenticationProvider using the DaoAuthenticationProvider,
     * which relies on the custom UserDetailsService and password encoder.
     *
     * @return Configured AuthenticationProvider.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService());
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder()); // Set strong password encoder
        return daoAuthenticationProvider;
    }

    /**
     * Provides the AuthenticationManager used for managing authentication requests.
     *
     * @param configuration The AuthenticationConfiguration provided by Spring Security.
     * @return Configured AuthenticationManager.
     * @throws Exception if there are issues retrieving the AuthenticationManager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Configures a PasswordEncoder bean using BCrypt, which is highly secure and commonly used for hashing passwords.
     * BCrypt automatically generates a unique salt for each password, making brute-force and rainbow table attacks impractical.
     *
     * @return BCryptPasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}

