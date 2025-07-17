package com.sb.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class JwtValidationGatewayFilterFactory extends AbstractGatewayFilterFactory<Object> {

    private final WebClient userWebClient;
    private final WebClient customerWebClient;

    private static final Logger logger = LoggerFactory.getLogger(JwtValidationGatewayFilterFactory.class);

    public JwtValidationGatewayFilterFactory(WebClient.Builder webClientBuilder,
                                             @Value("${user.service.url}") String userServiceUrl,
                                             @Value("${customer.service.url}") String customerServiceUrl) {

        this.userWebClient = webClientBuilder.baseUrl(userServiceUrl).build();
        this.customerWebClient = webClientBuilder.baseUrl(customerServiceUrl).build();

        logger.info("JwtValidationGatewayFilterFactory initialized with userServiceUrl={} and customerServiceUrl={}", userServiceUrl, customerServiceUrl);
    }

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            String path = exchange.getRequest().getURI().getPath();

            logger.debug("Processing JWT validation for path: {}", path);

            if (token == null || !token.startsWith("Bearer ")) {
                logger.warn("Unauthorized request: Missing or invalid Authorization header.");
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            WebClient targetClient;
            String validateUri;

            // Routing logic based on path
            if (path.startsWith("/api/user") || path.startsWith("/user") || path.startsWith("/api/product/auth") || path.startsWith("/product/auth")
                || path.startsWith("/api/layout/auth") || path.startsWith("/layout/auth") || path.startsWith("/api/cart/auth") || path.startsWith("/cart/auth")
                || path.startsWith("/api/bill/auth") || path.startsWith("/bill/auth") ){
                targetClient = userWebClient;
                validateUri = "/user/profile/validate";
            } else if (path.startsWith("/api/customer") || path.startsWith("/customer") || path.startsWith("/api/shopping-list") || path.startsWith("/shopping-list")
                       || path.startsWith("/api/product/all") || path.startsWith("/product/all") || path.startsWith("/api/cart/customer") || path.startsWith("/cart/customer")
                        || path.startsWith("/api/bill/customer") || path.startsWith("/bill/customer")) {
                targetClient = customerWebClient;
                validateUri = "/customer/profile/validate";
            } else {
                // Default fallback (internal endpoints)
                targetClient = userWebClient;
                validateUri = "/user/profile/validate";
            }

            logger.info("Validating JWT via {} for path: {}", validateUri, path);

            return targetClient.get()
                    .uri(validateUri)
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .retrieve()
                    .toBodilessEntity()
                    .doOnSuccess(resp -> logger.info("JWT validation succeeded for path: {}", path))
                    .then(chain.filter(exchange))
                    .onErrorResume(ex -> {
                        logger.error("JWT validation failed: {}", ex.getMessage());
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        };
    }
}
