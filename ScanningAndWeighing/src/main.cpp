#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecureBearSSL.h>
#include <PubSubClient.h>
#include <LittleFS.h>
#include <SoftwareSerial.h>
#include <time.h>
#include <HX711.h>

// === WiFi & AWS IoT Configuration ===
const char* ssid = "Dialog 4G 672";
const char* password = "f6A40De1";
const char* awsEndpoint = "apgkm0fe4pifa-ats.iot.us-east-1.amazonaws.com";

// === MQTT Topics ===
const char* barcodeTopic = "products/barcode/cart001";
const char* weightTopic = "products/weight/cart001";
const char* checkoutRequestTopic = "checkout/request/cart001";

// === Barcode Scanner Serial ===
SoftwareSerial scannerSerial(D7, D8);  // RX, TX

// === HX711 Load Cell ===
#define DOUT D2
#define CLK  D1
HX711 scale;
float calibration_factor = 990.0;
const float WEIGHT_THRESHOLD = 5.0;
const float MAX_WEIGHT = 5000.0;

// === AWS IoT SSL Client and MQTT Client ===
BearSSL::WiFiClientSecure espClient;
PubSubClient client(espClient);
BearSSL::X509List client_crt;
BearSSL::PrivateKey client_key;
BearSSL::X509List ca_cert;

float lastStableWeight = 0;
unsigned long lastWeightTime = 0;
const unsigned long WEIGHT_STABILITY_TIME = 2000;

// === WiFi Connect ===
void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 30) {
    delay(500);
    Serial.print(".");
    attempt++;
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? "\nConnected!" : "\nWiFi Failed!");
}

// === Time Sync ===
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
  Serial.println(now >= 8 * 3600 * 2 ? "\nTime synced!" : "\nTime sync failed");
}

// === Load AWS Certificates ===
void loadCertificates() {
  if (!LittleFS.begin()) {
    Serial.println("LittleFS mount failed");
    return;
  }

  File cert = LittleFS.open("/certificate.pem.crt", "r");
  File privateKey = LittleFS.open("/private.pem.key", "r");
  File ca = LittleFS.open("/AmazonRootCA1.pem", "r");

  if (!cert || !privateKey || !ca) {
    Serial.println("Missing cert files");
    espClient.setInsecure();  // Optional fallback
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
      Serial.println("Connected!");
      client.subscribe(checkoutRequestTopic);
    } else {
      Serial.printf("Failed. State=%d. Retrying...\n", client.state());
      delay(3000);
    }
  }
}

// === Get Weight Function ===
float getFilteredWeight() {
  if (!scale.is_ready()) return -1;

  const int readingsCount = 10;
  float total = 0;
  int valid = 0;

  for (int i = 0; i < readingsCount; i++) {
    if (scale.wait_ready_timeout(200)) {
      float w = scale.get_units(1);
      total += w;
      valid++;
    }
    yield();
  }

  if (valid < readingsCount / 2) return -1;

  float avg = total / valid;
  return (abs(avg) < WEIGHT_THRESHOLD) ? 0.0 : avg;
}

// === MQTT Callback for Checkout ===
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];

  if (String(topic) == checkoutRequestTopic && msg == "checkout") {
    float weight = getFilteredWeight();
    String payload;

    if (weight >= 0 && weight <= MAX_WEIGHT) {
      payload = "{\"weight\": " + String(weight, 2) + "}";
    } else if (weight < WEIGHT_THRESHOLD) {
      payload = "{\"weight\": 0, \"message\": \"no_weight\"}";
    } else {
      payload = "{\"message\": \"invalid_reading\"}";
    }

    if (client.publish(weightTopic, payload.c_str())) {
      Serial.println("Weight published.");
    } else {
      Serial.println("Failed to publish weight.");
    }
  }
}

// === Setup ===
void setup() {
  Serial.begin(115200);
  scannerSerial.begin(9600);
  scale.begin(DOUT, CLK);
  scale.set_scale(calibration_factor);
  scale.tare();

  connectWiFi();
  syncTime();
  loadCertificates();

  client.setServer(awsEndpoint, 8883);
  client.setCallback(mqttCallback);
}

// === Loop ===
void loop() {
  if (!client.connected()) mqttConnect();
  client.loop();

  // Barcode Scanner Read - FIXED WITH ERROR CHECKING
  if (scannerSerial.available()) {
    String barcode = scannerSerial.readStringUntil('\n');
    barcode.trim();
    if (barcode.length() > 0) {
      Serial.println("Scanned: " + barcode);
      String payload = "{\"barcode\": \"" + barcode + "\"}";
      
      // Added error checking and feedback
      if (client.publish(barcodeTopic, payload.c_str())) {
        Serial.println("Barcode published.");
      } else {
        Serial.println("Failed to publish barcode.");
        Serial.printf("MQTT Client State: %d\n", client.state());
      }
    }
  }

  delay(100);
}