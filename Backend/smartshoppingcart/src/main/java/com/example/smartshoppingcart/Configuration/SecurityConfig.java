package com.example.smartshoppingcart.Configuration;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import static com.example.smartshoppingcart.Model.Role.*;

@Configuration // Indicates that this class is a configuration class
@EnableWebSecurity // Enables Spring Security
@RequiredArgsConstructor // Lombok annotation to generate constructor with required arguments
@EnableMethodSecurity // Enables method-level security annotations like @PreAuthorize
public class SecurityConfig {

    // List of public (white-listed) URLs that do not require authentication
    private static final String[] WHITE_LIST_URL =
            {"/v2/api-docs",
                    "/v3/api-docs",
                    "/v3/api-docs/**",
                    "/swagger-resources",
                    "/swagger-resources/**",
                    "/configuration/ui",
                    "/configuration/security",
                    "/swagger-ui/**",
                    "/webjars/**",
                    "/swagger-ui.html"};

    // Dependencies injected through constructor
    private final JWTAuthenticationFilter jwtAuthFilter; // Custom JWT authentication filter
    private final AuthenticationProvider authenticationProvider; // Authentication logic
    private final LogoutHandler logoutHandler; // Custom logout handling
    private final InactivityFilter inactivityFilter; // Filter to manage user inactivity


    /**
     * Configures the security filter chain, defining rules for endpoint access, session management,
     * authentication filters, and logout behavior.
     *
     * @param http The HttpSecurity object to configure.
     * @return A SecurityFilterChain defining the security configuration.
     * @throws Exception If any error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable) // Disables CSRF protection (not required for stateless APIs)
                // Uncomment the following line to enable CORS if needed
//              .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        // Allow access to white-listed URLs
                        .requestMatchers(WHITE_LIST_URL).permitAll()

                        // Authorization rules for specific endpoints
                        .requestMatchers("/api/v1/auth/register").permitAll()
                        .requestMatchers("/api/v1/auth/login").permitAll()
                        .requestMatchers("/api/v1/auth/logout").permitAll()
                        .requestMatchers("/api/v1/auth/uploadProfileImage").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("api/v1/auth/deleteProfileImage").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())


                        // User endpoints (requires authentication for various roles)
                        .requestMatchers("/api/v1/users/changePassword").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/users/forgetPassword").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/users/resetPassword").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/users/deleteUser").hasAnyRole(ADMIN.name())

                        //Endpoints with Products
                        .requestMatchers("/api/v1/products/scanBarcode").hasAnyRole(ADMIN.name(), MANAGER.name())
                        .requestMatchers("/api/v1/products/addProduct").hasAnyRole(ADMIN.name(), MANAGER.name())
                        .requestMatchers("/api/v1/products/updateProduct").hasAnyRole(ADMIN.name(), MANAGER.name())
                        .requestMatchers("/api/v1/products/deleteProduct").hasAnyRole(ADMIN.name())
                        .requestMatchers("/api/v1/products/view").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/products/view/{identifier}").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/products/view-with-brand").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())

                        //Endpoints With Cart
                        .requestMatchers("/api/v1/cart/all").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/cart/id/{id}").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/cart/addItem").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/cart/updateItem").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())
                        .requestMatchers("/api/v1/cart/deleteItem").hasAnyRole(ADMIN.name(), MANAGER.name(), USER.name())

                        //


                        // All other endpoints require authentication
                        .anyRequest()
                        .authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless sessions for APIs
                )
                .authenticationProvider(authenticationProvider) // Custom authentication provider
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
//                .addFilterBefore(inactivityFilter, UsernamePasswordAuthenticationFilter.class); // Add inactivity filter
                .addFilterBefore(inactivityFilter, JWTAuthenticationFilter.class); // Add inactivity filter

        // Logout configuration
        http.logout(logout -> logout
                .logoutUrl("/api/v1/auth/logout") // Logout endpoint
                .addLogoutHandler(logoutHandler) // Custom logout handling
                .logoutSuccessHandler((request, response, authentication) ->
                        SecurityContextHolder.clearContext() // Clear security context after logout
                )
        );

        return http.build();
    }

// Uncomment and configure the following CORS bean if required for cross-origin requests
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("Add Url Here *both https://www. and https://", "Local host url")); // Allow origins
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")); // HTTP methods
//        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With")); // Allow specific headers
//        configuration.setExposedHeaders(List.of("Authorization")); // Expose specific headers
//        configuration.setAllowCredentials(true); // Allow credentials (cookies, etc.)
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration); // Apply CORS settings globally
//        return source;
//    }

}
