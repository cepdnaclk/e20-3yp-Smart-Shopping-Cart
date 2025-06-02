#include "emqx_iot.h"
#include <ESP8266WiFi.h>
#include <WiFiClientSecureBearSSL.h>
#include <PubSubClient.h>
#include <LittleFS.h>

String ssid, password, mqtt_server, mqtt_user, mqtt_pass, mqtt_topic;
int mqtt_port;

BearSSL::WiFiClientSecure net;
PubSubClient client(net);

// Parse key=value pairs from env-like file
bool loadEnv(const char* path) {
    File file = LittleFS.open(path, "r");
    if (!file) {
        Serial.println("Failed to open env file");
        return false;
    }

    while (file.available()) {
        String line = file.readStringUntil('\n');
        line.trim();
        if (line.startsWith("#") || !line.length()) continue;

        int sep = line.indexOf('=');
        if (sep == -1) continue;

        String key = line.substring(0, sep);
        String value = line.substring(sep + 1);

        if (key == "WIFI_SSID") ssid = value;
        else if (key == "WIFI_PASSWORD") password = value;
        else if (key == "MQTT_SERVER") mqtt_server = value;
        else if (key == "MQTT_PORT") mqtt_port = value.toInt();
        else if (key == "MQTT_USER") mqtt_user = value;
        else if (key == "MQTT_PASS") mqtt_pass = value;
        else if (key == "MQTT_TOPIC") mqtt_topic = value;
    }

    file.close();
    return true;
}

void connect_wifi() {
    WiFi.begin(ssid.c_str(), password.c_str());
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("WiFi connected");
}

void connect_mqtt() {
    int retries = 0;
    while (!client.connected() && retries < 3) {
        Serial.println("Connecting to EMQX...");
        Serial.printf("Server: %s\n", mqtt_server.c_str());
        Serial.printf("Port: %d\n", mqtt_port);
        Serial.printf("User: %s\n", mqtt_user.c_str());
        Serial.printf("Topic: %s\n", mqtt_topic.c_str());

        String clientId = "ESP8266Client-" + String(random(0xffff), HEX);
        if (client.connect(clientId.c_str(), mqtt_user.c_str(), mqtt_pass.c_str())) {
            Serial.println("MQTT connected");
            return;
        } else {
            int state = client.state();
            Serial.printf("MQTT connection failed, rc=%d ", state);
            switch (state) {
                case -4: Serial.println("(MQTT_CONNECTION_TIMEOUT)"); break;
                case -3: Serial.println("(MQTT_CONNECTION_LOST)"); break;
                case -2: Serial.println("(MQTT_CONNECT_FAILED)"); break;
                case -1: Serial.println("(MQTT_DISCONNECTED)"); break;
                case 1: Serial.println("(MQTT_CONNECT_BAD_PROTOCOL)"); break;
                case 2: Serial.println("(MQTT_CONNECT_BAD_CLIENT_ID)"); break;
                case 3: Serial.println("(MQTT_CONNECT_UNAVAILABLE)"); break;
                case 4: Serial.println("(MQTT_CONNECT_BAD_CREDENTIALS)"); break;
                case 5: Serial.println("(MQTT_CONNECT_UNAUTHORIZED)"); break;
                default: Serial.println("(unknown)"); break;
            }
            retries++;
            delay(5000);
        }
    }
}

bool emqx_iot_setup() {
    Serial.println("Starting emqx_iot_setup...");
    if (!LittleFS.begin()) {
        Serial.println("LittleFS mount failed");
        return false;
    }
    Serial.println("LittleFS mounted successfully");

    Dir dir = LittleFS.openDir("/");
    while (dir.next()) {
        Serial.printf("Found file: %s\n", dir.fileName().c_str());
    }

    if (!loadEnv("/emqx.env")) {
        Serial.println("Failed to load env");
        return false;
    }

    // INSECURE MODE: skip CA cert validation
    net.setInsecure();  // <--- this disables certificate validation

    net.setBufferSizes(1024, 1024); // Increased buffer size for SSL
    net.setTimeout(30000);          // Increased timeout for SSL handshake
    
    connect_wifi();
    client.setServer(mqtt_server.c_str(), mqtt_port);
    client.setSocketTimeout(60);
    client.setKeepAlive(60);
    connect_mqtt();
    return true;
}

void emqx_iot_loop() {
    if (!client.connected()) connect_mqtt();
    client.loop();
}

void publish_position(float x, float y, float z) {
    char payload[128];
    snprintf(payload, sizeof(payload), "{\"x\":%.4f,\"y\":%.4f,\"z\":%.4f}", x, y, z);
    bool success = client.publish(mqtt_topic.c_str(), payload);
    if (!success) {
        Serial.println("Failed to publish MQTT message");
        Serial.printf("MQTT state: %d\n", client.state());
    } else {
        Serial.println("MQTT message published successfully");
    }
}
