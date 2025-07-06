#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecureBearSSL.h>
#include <PubSubClient.h>
#include <LittleFS.h>
#include <SoftwareSerial.h>
#include <time.h>

// === Configuration ===
// WiFi credentials
const char* ssid = "Dialog 4G 672";
const char* password = "f6A40De1";

// AWS IoT Core endpoint
const char* awsEndpoint = "apgkm0fe4pifa-ats.iot.us-east-1.amazonaws.com";

// MQTT Topic
const char* topic = "products/barcode/scanned";

// Barcode scanner serial
SoftwareSerial scannerSerial(D7, D8);  // RX, TX

// Certificate objects
BearSSL::WiFiClientSecure espClient;
PubSubClient client(espClient);
BearSSL::X509List client_crt;
BearSSL::PrivateKey client_key;
BearSSL::X509List ca_cert;

// === WiFi Connection ===
void connectWiFi() {
  Serial.print("Connecting to WiFi SSID: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 30) {
    delay(500);
    Serial.print(".");
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi.");
  }
}

// === NTP Time Sync ===
void syncTime() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.print("Syncing time");
  time_t now = time(nullptr);
  int attempts = 0;
  while (now < 8 * 3600 * 2 && attempts < 30) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    attempts++;
  }
  Serial.println(attempts < 30 ? "\nTime synced!" : "\nTime sync failed!");
}

// === Load AWS IoT Certificates ===
void loadCertificates() {
  if (!LittleFS.begin()) {
    Serial.println("LittleFS mount failed");
    return;
  }

  File cert = LittleFS.open("/certificate.pem.crt", "r");
  File privateKey = LittleFS.open("/private.pem.key", "r");
  File ca = LittleFS.open("/AmazonRootCA1.pem", "r");

  if (!cert || !privateKey || !ca) {
    Serial.println("Certificate files missing");
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

  Serial.println("Certificates loaded.");
}

// === MQTT Connect ===
void mqttConnect() {
  while (!client.connected()) {
    Serial.print("Connecting to AWS IoT...");
    if (client.connect("ESP8266Client")) {
      Serial.println("connected!");
    } else {
      Serial.printf("failed, rc=%d. Retrying...\n", client.state());
      delay(5000);
    }
  }
}

// === Setup ===
void setup() {
  Serial.begin(115200);
  scannerSerial.begin(9600);  // GM65 baud rate
  delay(100);

  connectWiFi();
  syncTime();
  loadCertificates();

  client.setServer(awsEndpoint, 8883);
}

// === Loop ===
void loop() {
  if (!client.connected()) {
    mqttConnect();
  }
  client.loop();

  // Check if a barcode is scanned
  if (scannerSerial.available()) {
    String barcode = scannerSerial.readStringUntil('\n');
    barcode.trim();

    if (barcode.length() > 0) {
      Serial.print("Scanned: ");
      Serial.println(barcode);

      // Create JSON payload
      String payload = "{\"message\": \"" + barcode + "\"}";

      // Publish to AWS IoT
      if (client.publish(topic, payload.c_str())) {
        Serial.println("Published to AWS IoT!");
      } else {
        Serial.println("Publish failed.");
      }
    }
  }

  delay(100);  // Light delay
}
