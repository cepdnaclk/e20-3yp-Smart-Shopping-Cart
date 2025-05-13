#include "mqtt_handler.h"
#include <ESP8266WiFi.h>
#include <WiFiClientSecureBearSSL.h>
#include <LittleFS.h>
#include <ArduinoJson.h>
#include "rfid_handler.h" // To access buzz logic

// MQTT and SSL clients
BearSSL::WiFiClientSecure espClient;
PubSubClient client(espClient);

// AWS IoT Core endpoint
const char *awsEndpoint = "ajc4roklp9rho-ats.iot.us-east-1.amazonaws.com";

// Certificates
BearSSL::X509List client_crt;
BearSSL::PrivateKey client_key;
BearSSL::X509List ca_cert;

// Expose the client
PubSubClient &getMQTTClient()
{
    return client;
}

// === MQTT Callback Handler ===
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    String message;
    for (unsigned int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }

    Serial.print("MQTT message received on topic ");
    Serial.print(topic);
    Serial.print(": ");
    Serial.println(message);

    // Parse JSON
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error)
    {
        Serial.print("JSON parse failed: ");
        Serial.println(error.c_str());
        return;
    }

    bool buzz = doc["buzz"];
    if (buzz)
    {
        Serial.println("Buzzing: Payment not made.");
        buzzBuzzer(); // defined in rfid_handler
    }
    else
    {
        Serial.println("Payment done. No buzzer.");
    }
}

// === Load certificates from LittleFS ===
void loadCertificates()
{
    if (!LittleFS.begin())
    {
        Serial.println("Failed to mount LittleFS");
        return;
    }

    File cert = LittleFS.open("/certificate.pem.crt", "r");
    File privateKey = LittleFS.open("/private.pem.key", "r");
    File ca = LittleFS.open("/AmazonRootCA1.pem", "r");

    if (!cert || !privateKey || !ca)
    {
        Serial.println("Certificate files missing or failed to open");
        return;
    }

    client_crt.append(cert.readString().c_str());
    client_key.parse(privateKey.readString().c_str());
    ca_cert.append(ca.readString().c_str());

    espClient.setClientRSACert(&client_crt, &client_key);
    espClient.setTrustAnchors(&ca_cert);

    cert.close();
    privateKey.close();
    ca.close();

    Serial.println("Certificates loaded successfully!");
}

// === MQTT Setup ===
void setupMQTT()
{
    client.setServer(awsEndpoint, 8883);
    client.setCallback(mqttCallback); // Register callback here
}

// === MQTT Connection & Loop Handling ===
void handleMQTT()
{
    if (!client.connected())
    {
        Serial.print("Connecting to AWS IoT...");
        if (client.connect("SmartCartESP"))
        {
            Serial.println("Connected to AWS IoT");

            // Subscribe to receive response from server
            if (client.subscribe("smartcart/response"))
            {
                Serial.println("Subscribed to smartcart/response");
            }
            else
            {
                Serial.println("Failed to subscribe to smartcart/response");
            }
        }
        else
        {
            Serial.printf("Connection failed, rc=%d. Retrying in 5 seconds...\n", client.state());
            delay(5000);
        }
    }
    client.loop();
}
