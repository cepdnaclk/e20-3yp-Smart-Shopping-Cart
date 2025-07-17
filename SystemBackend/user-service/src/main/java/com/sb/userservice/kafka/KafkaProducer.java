package com.sb.userservice.kafka;

import com.sb.backupservice.grpc.UserRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {

    private final KafkaTemplate<String, byte[]> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String, byte[]> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendUserCreatedEvent(String topic, UserRequest userRequest) {
        byte[] messageBytes = userRequest.toByteArray(); // Protobuf serialization
        kafkaTemplate.send(topic, messageBytes);
    }

}
