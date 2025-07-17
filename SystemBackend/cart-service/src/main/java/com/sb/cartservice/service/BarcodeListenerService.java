//package com.sb.cartservice.service;
//
//import com.sb.cartservice.config.SslUtil;
//import jakarta.annotation.PostConstruct;
//import jakarta.annotation.PreDestroy;
//import org.eclipse.paho.client.mqttv3.MqttClient;
//import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import javax.net.ssl.SSLSocketFactory;
//import java.io.InputStream;
//import java.util.Map;
//import java.util.UUID;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Service
//public class BarcodeListenerService {
//
//    private static final Logger logger = LoggerFactory.getLogger(BarcodeListenerService.class);
//
//    private MqttClient mqttClient;
//
//    // Temporary barcode store (e.g., deviceId -> barcode)
//    private final Map<String, String> barcodeCache = new ConcurrentHashMap<>();
//
//    @Value("${aws.iot.endpoint}")
//    private String endpoint;
//
//    @Value("${aws.iot.clientId}")
//    private String clientId;
//
//    @Value("${aws.iot.topic}")
//    private String topic;
//
//    @PostConstruct
//    public void init() {
//        try {
//            String brokerUrl = "ssl://" + endpoint + ":8883";
//
//            InputStream ca = getClass().getClassLoader().getResourceAsStream("certs/AmazonRootCA1.pem");
//            InputStream cert = getClass().getClassLoader().getResourceAsStream("certs/certificate.pem.crt");
//            InputStream key = getClass().getClassLoader().getResourceAsStream("certs/private.pem.key");
//
//            SSLSocketFactory socketFactory = SslUtil.getSocketFactory(ca, cert, key);
//
//            mqttClient = new MqttClient(brokerUrl, clientId + "-" + UUID.randomUUID(), null);
//
//            MqttConnectOptions connOpts = new MqttConnectOptions();
//            connOpts.setSocketFactory(socketFactory);
//            connOpts.setCleanSession(true);
//
//            mqttClient.connect(connOpts);
//            logger.info("✅ Connected to AWS IoT Core");
//
//            mqttClient.subscribe(topic, (t, msg) -> {
//                String payload = new String(msg.getPayload());
//                logger.info("📦 Received barcode payload: {}", payload);
//
//                // Example: assume payload is the raw barcode value
//                barcodeCache.put("default", payload); // "default" could be a device ID
//                logger.info("✅ Barcode cached: {}", payload);
//            });
//
//            logger.info("📡 Subscribed to topic: {}", topic);
//
//        } catch (Exception e) {
//            logger.error("❌ Failed to connect to AWS IoT Core: {}", e.getMessage(), e);
//        }
//    }
//
//    @PreDestroy
//    public void cleanup() {
//        try {
//            if (mqttClient != null && mqttClient.isConnected()) {
//                mqttClient.disconnect();
//                mqttClient.close();
//                logger.info("🛑 Disconnected from AWS IoT Core.");
//            }
//        } catch (Exception e) {
//            logger.warn("⚠️ Error while disconnecting MQTT client", e);
//        }
//    }
//
//    // Getter to retrieve cached barcode (e.g., for product submission)
//    public String getLatestBarcode() {
//        return barcodeCache.get("default"); // can expand to use deviceId if needed
//    }
//
//    public void clearLatestBarcode() {
//        barcodeCache.remove("default");
//    }
//
//}
