package com.sb.emailservice.service;

import com.sb.events.CustomerEvent;
import com.sb.events.UserEvent;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {

    private final MailService mailService;

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumer.class);


    public KafkaConsumer(MailService mailService) { // ✅ Fixed constructor name
        this.mailService = mailService;
    }


    @KafkaListener(topics = "customer-events", groupId = "mail-group")
    public void consumeCustomerEvent(ConsumerRecord<String, byte[]> record) {
        try {
            CustomerEvent request = CustomerEvent.parseFrom(record.value());

            logger.info("Received Kafka event for email: {}", request.getEmail());

            mailService.sendLoginDetails(
                    request.getEmail(),
                    request.getUsername(),
                    request.getPassword()
            );

            logger.info("Login email sent to: {}", request.getEmail());

        } catch (Exception e) {
            logger.error("Failed to handle customer-events Kafka message", e);
        }
    }

    @KafkaListener(topics = "user-events", groupId = "mail-group")
    public void consumeUserEvent(ConsumerRecord<String, byte[]> record) {
        try {
            UserEvent request = UserEvent.parseFrom(record.value());
            logger.info("Received Kafka event for email: {}", request.getEmail());

            mailService.sendLoginDetails(
                    request.getEmail(),
                    request.getUsername(),
                    request.getPassword()
            );

            logger.info("Login email sent to: {}", request.getEmail());
        }catch (Exception e) {
            logger.error("Failed to handle user-events Kafka message", e);
        }
    }

}
