package com.sb.customerservice.config;

import com.sb.customerservice.service.JWTService;
import io.grpc.Metadata;
import io.grpc.ServerCall;
import net.devh.boot.grpc.server.security.authentication.GrpcAuthenticationReader;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.annotation.Nullable;
import java.util.Collections;

@Component
public class JwtGrpcAuthenticationReader implements GrpcAuthenticationReader {

    private final JWTService jwtService;

    public JwtGrpcAuthenticationReader(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Authentication readAuthentication(@Nullable ServerCall<?, ?> serverCall, Metadata metadata) throws AuthenticationException {
        // Get the "Authorization" header
        Metadata.Key<String> AUTH_HEADER = Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER);
        String value = metadata.get(AUTH_HEADER);

        if (value != null && value.startsWith("Bearer ")) {
            String jwt = value.substring(7);
            String username = jwtService.extractUserName(jwt);
            String role = jwtService.extractRole(jwt); // new method!

            if (username != null && role != null) {
                // The authority should be "ROLE_" + role, e.g., "ROLE_CUSTOMER"
                String authority = "ROLE_" + role.toUpperCase();
                return new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singleton(new SimpleGrantedAuthority(authority))
                );
            }
        }
        return null;
    }

}
