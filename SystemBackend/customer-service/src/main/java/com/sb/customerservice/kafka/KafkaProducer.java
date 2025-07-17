package com.sb.customerservice.kafka;

import com.sb.customerbackupservice.grpc.CustomerRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {

    private final KafkaTemplate<String, byte[]> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String, byte[]> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendCustomerCreatedEvent(String topic, CustomerRequest customerRequest) {
        byte[] messageBytes = customerRequest.toByteArray(); // Protobuf serialization
        kafkaTemplate.send(topic, messageBytes);
    }

}
