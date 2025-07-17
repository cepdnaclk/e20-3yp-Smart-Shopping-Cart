package com.sb.userservice.config;

import com.sb.userservice.dto.RegisterUserDTO;
import com.sb.userservice.model.Role;
import com.sb.userservice.repository.UserRepository;
import com.sb.userservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final UserService userService;

    public AdminInitializer(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
        logger.info("✅ AdminInitializer bean created.");
    }

    @Override
    public void run(String... args) {

        logger.info("🚀 AdminInitializer is running...");


        if (userRepository.existsByRole(Role.ADMIN)) {
            logger.info("🛑 Admin user already exists. Skipping creation.");
            return;
        }

        // Prepare the admin registration DTO
        RegisterUserDTO dto = new RegisterUserDTO();
        dto.setFirstName("Minuk");
        dto.setLastName("Sankalpa");
        dto.setEmail("sranawaka56@gmail.com");
        dto.setPhoneNumber("+94774049338");
        dto.setNic("200163827568V");
        dto.setRole(Role.ADMIN);

        try {
            // Call existing method
            String result = userService.registerUser(dto, null);
            logger.info("✅ ADMIN user registered successfully: {}", result);
        } catch (Exception e) {
            logger.error("❌ Failed to register ADMIN user at startup", e);
        }
    }
}
