package com.example.smartshoppingcart.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

/**
 * Configuration class for OpenAPI/Swagger documentation.
 * <p>
 * This class defines metadata and configuration for the API documentation,
 * including title, description, contact information, servers, and security schemes.
 */
@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Smart Shopping Cart Development Team",
                        email = "e20318@eng.pdn.ac.lk"
                ),
                description = "OpenAPI documentation for Smart Shopping Cart.\n\n"
                        + "**Development Team:**\n"
                        + "- **Dimantha Thilakasiri** (e20397@eng.pdn.ac.lkk)\n"
                        + "- **Chamudhitha Nawarathna** (e20035@eng.pdn.ac.lk)\n"
                        + "- **Supun Dhananji** (e20062@eng.pdn.ac.lk)\n"
                        + "- **Janidu Iroshan** (e20318@eng.pdn.ac.lk)",
                title = "OpenAPI Specification - Smart Shopping Cart"
        ),
        servers = {
                @Server(
                        description = "Local ENV", // Description of the server
                        url = "http://localhost:8080" // Local server URL
                ),
                // Uncomment and configure for production deployment
//                @Server(
//                        description = "EC2", // Description of the production server
//                        url = "https://api.rokmcbt.com" // Production server URL
//                )
        },
        security = {
                @SecurityRequirement(
                        name = "bearerAuth" // Name of the security scheme defined below
                )
        }
)

@SecurityScheme(
        name = "bearerAuth", // Security scheme name referenced in @SecurityRequirement
        description = "JWT auth description", // Description of the JWT authentication
        scheme = "bearer", // Type of authentication scheme
        type = SecuritySchemeType.HTTP, // HTTP authentication type
        bearerFormat = "JWT", // Format of the bearer token
        in = SecuritySchemeIn.HEADER // JWT token is expected in the HTTP header
)
public class OpenApiConfig {
}
