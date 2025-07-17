package com.sb.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
public class RoleValidationGatewayFilterFactory extends AbstractGatewayFilterFactory<RoleValidationGatewayFilterFactory.Config> {

    private final WebClient userWebClient;
    private final WebClient customerWebClient;

    private static final Logger logger = LoggerFactory.getLogger(RoleValidationGatewayFilterFactory.class);

    public RoleValidationGatewayFilterFactory(WebClient.Builder webClientBuilder,
                                              @Value("${user.service.url}") String userServiceUrl,
                                              @Value("${customer.service.url}") String customerServiceUrl) {
        super(Config.class);
        this.userWebClient = webClientBuilder.baseUrl(userServiceUrl).build();
        this.customerWebClient = webClientBuilder.baseUrl(customerServiceUrl).build();

        logger.info("RoleValidationGatewayFilterFactory initialized with userServiceUrl={} and customerServiceUrl={}", userServiceUrl, customerServiceUrl);
    }

    public static class Config {
        private List<String> allowedRoles;

        public List<String> getAllowedRoles() {
            return allowedRoles;
        }

        public void setAllowedRoles(List<String> allowedRoles) {
            this.allowedRoles = allowedRoles;
        }
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            String path = exchange.getRequest().getURI().getPath();
            logger.debug("Role validation initiated for path: {}", path);

            // 1. Check token validity early
            if (!StringUtils.hasText(token) || !token.startsWith("Bearer ")) {
                logger.warn("Unauthorized request: Missing or invalid Authorization header.");
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // 2. Determine service type by path prefix
            // PRODUCT AUTH ENDPOINT (admin only)
            if (path.startsWith("/product/auth")) {
                logger.info("Validating /product/auth endpoint with user roles only");
                return userWebClient.get()
                        .uri("/user/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /product/auth/** to role '{}'", role);
                                return chain.filter(exchange);
                            }
                            logger.warn("Access denied for /product/auth/** to role '{}'", role);
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                        .onErrorResume(ex -> {
                            logger.error("Role validation failed: {}", ex.getMessage());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }

            // PRODUCT ALL ENDPOINT (admin + customer)
            if (path.startsWith("/product/all")) {
                logger.info("Validating /product/all endpoint with both user and customer roles");
                // Try user roles first
                return userWebClient.get()
                        .uri("/user/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /product/all/** to USER role '{}'", role);
                                return chain.filter(exchange);
                            } else {
                                // Try customer service next
                                logger.info("User role '{}' not permitted for /product/all/**, checking customer roles...", role);
                                return customerWebClient.get()
                                        .uri("/customer/profile/role")
                                        .header(HttpHeaders.AUTHORIZATION, token)
                                        .retrieve()
                                        .bodyToMono(Map.class)
                                        .flatMap(customerResp -> {
                                            String customerRole = customerResp.get("role") != null ? customerResp.get("role").toString() : null;
                                            if (customerRole != null && config.allowedRoles.contains(customerRole)) {
                                                logger.info("Access granted for /product/all/** to CUSTOMER role '{}'", customerRole);
                                                return chain.filter(exchange);
                                            }
                                            logger.warn("Access denied for /product/all/** to roles '{}', '{}'", role, customerRole);
                                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                                            return exchange.getResponse().setComplete();
                                        })
                                        .onErrorResume(ex -> {
                                            logger.error("Customer role validation failed: {}", ex.getMessage());
                                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                                            return exchange.getResponse().setComplete();
                                        });
                            }
                        })
                        .onErrorResume(ex -> {
                            // If user service fails, fallback to customer service
                            logger.warn("User role validation failed: {}. Trying customer service...", ex.getMessage());
                            return customerWebClient.get()
                                    .uri("/customer/profile/role")
                                    .header(HttpHeaders.AUTHORIZATION, token)
                                    .retrieve()
                                    .bodyToMono(Map.class)
                                    .flatMap(customerResp -> {
                                        String customerRole = customerResp.get("role") != null ? customerResp.get("role").toString() : null;
                                        if (customerRole != null && config.allowedRoles.contains(customerRole)) {
                                            logger.info("Access granted for /product/all/** to CUSTOMER role '{}'", customerRole);
                                            return chain.filter(exchange);
                                        }
                                        logger.warn("Access denied for /product/all/** to customer role '{}'", customerRole);
                                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                                        return exchange.getResponse().setComplete();
                                    })
                                    .onErrorResume(innerEx -> {
                                        logger.error("Customer role validation also failed: {}", innerEx.getMessage());
                                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                                        return exchange.getResponse().setComplete();
                                    });
                        });
            }

            if(path.startsWith("/layout/auth")){
                // Use userWebClient and /user/profile/role ONLY
                logger.info("Validating /layout/auth endpoint with Higher  roles only");
                return userWebClient.get()
                        .uri("/user/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /layout/auth/** to role '{}'", role);
                                return chain.filter(exchange);
                            }
                            logger.warn("Access denied for /layout/auth/** to role '{}'", role);
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                        .onErrorResume(ex -> {
                            logger.error("Role validation failed: {}", ex.getMessage());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }

            if (path.startsWith("/shopping-list")) {
                // Use customerWebClient and /customer/profile/role ONLY
                logger.info("Validating /shopping-list endpoint with CUSTOMER roles only (customer service)");
                return customerWebClient.get()
                        .uri("/customer/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /shopping-list/** to CUSTOMER role '{}'", role);
                                return chain.filter(exchange);
                            }
                            logger.warn("Access denied for /shopping-list/** to role '{}'", role);
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                        .onErrorResume(ex -> {
                            logger.error("Customer role validation failed: {}", ex.getMessage());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }

            if (path.startsWith("/cart/customer") || path.startsWith("/api/cart/customer")) {
                // Use customerWebClient and /customer/profile/role ONLY
                logger.info("Validating /cart endpoint with CUSTOMER roles only (customer service)");
                return customerWebClient.get()
                        .uri("/customer/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /cart/customer/** to CUSTOMER role '{}'", role);
                                return chain.filter(exchange);
                            }
                            logger.warn("Access denied for /cart/customer/** to role '{}'", role);
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                        .onErrorResume(ex -> {
                            logger.error("Customer role validation failed: {}", ex.getMessage());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }

            if (path.startsWith("/cart/auth") || path.startsWith("/api/cart/auth")) {
                // Use userWebClient and /user/profile/role ONLY
                logger.info("Validating /cart/auth endpoint with Higher roles only (user service)");
                return userWebClient.get()
                        .uri("/user/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /cart/auth/** to role '{}'", role);
                                return chain.filter(exchange);
                            }
                            logger.warn("Access denied for /cart/auth/** to role '{}'", role);
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                        .onErrorResume(ex -> {
                            logger.error("Role validation failed: {}", ex.getMessage());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }

            if (path.startsWith("/bill/customer") || path.startsWith("/api/bill/customer")) {
                // Use customerWebClient and /customer/profile/role ONLY
                logger.info("Validating /bill/customer endpoint with CUSTOMER roles only (customer service)");
                return customerWebClient.get()
                        .uri("/customer/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /bill/customer/** to CUSTOMER role '{}'", role);
                                return chain.filter(exchange);
                            }
                            logger.warn("Access denied for /bill/customer/** to role '{}'", role);
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                        .onErrorResume(ex -> {
                            logger.error("Customer role validation failed: {}", ex.getMessage());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });
            }

            if (path.startsWith("/bill/auth") || path.startsWith("/api/bill/auth")) {
                // Use userWebClient and /user/profile/role ONLY
                logger.info("Validating /bill/auth endpoint with Higher roles only (user service)");
                return userWebClient.get()
                        .uri("/user/profile/role")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(response -> {
                            String role = response.get("role") != null ? response.get("role").toString() : null;
                            if (role != null && config.allowedRoles.contains(role)) {
                                logger.info("Access granted for /bill/auth/** to role '{}'", role);
                                return chain.filter(exchange);
                            }
                            logger.warn("Access denied for /bill/auth/** to role '{}'", role);
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                        .onErrorResume(ex -> {
                            logger.error("Role validation failed: {}", ex.getMessage());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        });

            }

            // For all other paths, fallback to normal logic (default: user roles)
            logger.info("Default role validation path used (user roles only): {}", path);
            return userWebClient.get()
                    .uri("/user/profile/role")
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .flatMap(response -> {
                        String role = response.get("role") != null ? response.get("role").toString() : null;
                        if (role != null && config.allowedRoles.contains(role)) {
                            logger.info("Access granted for path '{}' to role '{}'", path, role);
                            return chain.filter(exchange);
                        }
                        logger.warn("Access denied for path '{}' to role '{}'", path, role);
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    })
                    .onErrorResume(ex -> {
                        logger.error("Role validation failed: {}", ex.getMessage());
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        };
    }
}
