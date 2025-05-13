#include <Arduino.h>
#include "wifi_handler.h"
#include "mqtt_handler.h"
#include "rfid_handler.h"
#include <ESP8266WiFi.h>

// Function to reconnect Wi-Fi and MQTT in case of failure
void reconnectWiFiAndMQTT()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("WiFi lost connection. Reconnecting...");
    connectWiFi(); // Reconnect WiFi
  }

  if (!getMQTTClient().connected())
  {
    Serial.println("MQTT lost connection. Reconnecting...");
    handleMQTT(); // Reconnect MQTT
  }
}

void setup()
{
  Serial.begin(115200);
  delay(100);

  // Initialize components
  initBuzzer();
  initRFID();

  // Connect to Wi-Fi and MQTT
  connectWiFi();
  syncTime();
  loadCertificates();
  setupMQTT();
}

void loop()
{
  // Reconnect Wi-Fi and MQTT if necessary
  reconnectWiFiAndMQTT();

  // Process MQTT messages
  getMQTTClient().loop(); // ✅ corrected

  // Check for RFID tags
  checkRFIDTag();

  delay(10); // Optional delay
}
