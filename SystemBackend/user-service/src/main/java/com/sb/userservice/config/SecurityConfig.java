package com.sb.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import static com.sb.userservice.model.Role.*;

@Configuration
public class SecurityConfig {

    private final JWTAuthenticationFilter jwtAuthFilter;
    private final InactivityFilter inactivityFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    public SecurityConfig(JWTAuthenticationFilter jwtAuthFilter,
                          InactivityFilter inactivityFilter,
                          AuthenticationProvider authenticationProvider, LogoutHandler logoutHandler) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.inactivityFilter = inactivityFilter;
        this.authenticationProvider = authenticationProvider;
        this.logoutHandler = logoutHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/user/auth/login").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless sessions for APIs
                )
                .authenticationProvider(authenticationProvider) // Custom authentication provider
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
                .addFilterBefore(inactivityFilter, JWTAuthenticationFilter.class); // Add inactivity filter
        ;

        // Logout configuration
        http.logout(logout -> logout
                .logoutUrl("/user/profile/logout") // Logout endpoint
                .addLogoutHandler(logoutHandler) // Custom logout handling
                .logoutSuccessHandler((request, response, authentication) ->
                        SecurityContextHolder.clearContext() // Clear security context after logout
                )
        );

        return http.build();
    }

}
