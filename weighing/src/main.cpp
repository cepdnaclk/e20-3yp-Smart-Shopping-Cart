#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecureBearSSL.h>
#include <PubSubClient.h>
#include <LittleFS.h>
#include <time.h>
#include <HX711.h>  // Load cell library

// === Configuration ===
const char* ssid = "Dialog 4G 672";
const char* password = "f6A40De1";
const char* awsEndpoint = "apgkm0fe4pifa-ats.iot.us-east-1.amazonaws.com";

const char* weightTopic = "products/weight/value";
const char* checkoutRequestTopic = "checkout/request";

// HX711 pins
#define DOUT D2
#define CLK  D1

HX711 scale;

// Calibration and filtering constants
float calibration_factor = 990.00;
const int NUM_READINGS = 10;        // More readings for better accuracy
const float WEIGHT_THRESHOLD = 5.0; // Minimum detectable weight (grams)
const float MAX_WEIGHT = 1000.0;    // Maximum reasonable weight (grams)

// Variables for weight filtering and stability
float lastStableWeight = 0.0;
unsigned long lastWeightTime = 0;
const unsigned long WEIGHT_STABILITY_TIME = 2000; // 2 seconds for stable reading

BearSSL::WiFiClientSecure espClient;
PubSubClient client(espClient);
BearSSL::X509List client_crt;
BearSSL::PrivateKey client_key;
BearSSL::X509List ca_cert;

bool timesynced = false;

// === Weight Reading Functions ===
float getFilteredWeight() {
  if (!scale.is_ready()) {
    return -1; // Error indicator
  }
  
  // Take multiple readings and filter out outliers
  float readings[NUM_READINGS];
  float sum = 0;
  int validReadings = 0;
  
  // Collect readings
  for (int i = 0; i < NUM_READINGS; i++) {
    if (scale.wait_ready_timeout(200)) { // 200ms timeout per reading
      readings[i] = scale.get_units(1); // Single reading per iteration
      sum += readings[i];
      validReadings++;
    } else {
      readings[i] = 0; // Mark as invalid
    }
    yield(); // Prevent watchdog reset
  }
  
  if (validReadings < NUM_READINGS/2) {
    Serial.println("Warning: Too many invalid readings");
    return -1;
  }
  
  // Calculate average
  float average = sum / validReadings;
  
  // Apply simple noise filter - if reading is very close to zero, make it zero
  if (abs(average) < WEIGHT_THRESHOLD) {
    average = 0.0;
  }
  
  return average;
}

bool isWeightStable(float currentWeight) {
  const float STABILITY_THRESHOLD = 2.0; // grams
  
  if (abs(currentWeight - lastStableWeight) < STABILITY_THRESHOLD) {
    if (millis() - lastWeightTime > WEIGHT_STABILITY_TIME) {
      return true;
    }
  } else {
    lastStableWeight = currentWeight;
    lastWeightTime = millis();
  }
  
  return false;
}

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
    yield();
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
  
  unsigned long startTime = millis();
  time_t now = time(nullptr);
  
  while (now < 8 * 3600 * 2 && (millis() - startTime) < 15000) {
    delay(200);
    yield();
    Serial.print(".");
    now = time(nullptr);
  }
  
  if (now >= 8 * 3600 * 2) {
    Serial.println("\nTime synced!");
    timesynced = true;
  } else {
    Serial.println("\nTime sync failed, continuing anyway...");
    timesynced = false;
  }
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
    Serial.println("Certificate files missing - continuing without SSL verification");
    espClient.setInsecure();
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

// === MQTT Callback ===
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String incoming = "";
  for (unsigned int i = 0; i < length; i++) {
    incoming += (char)payload[i];
  }

  Serial.print("MQTT Message received on topic: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  Serial.println(incoming);

  // Handle different commands
  if (String(topic) == checkoutRequestTopic) {
    if (incoming == "checkout") {
      // Get stable weight reading
      Serial.println("Checkout requested - taking weight measurement...");
      
      float weight = getFilteredWeight();
      
      if (weight >= 0) {  // Valid reading
        Serial.print("Measured weight: ");
        Serial.print(weight);
        Serial.println(" g");

        // Only send if weight is above threshold and reasonable
        if (weight >= WEIGHT_THRESHOLD && weight <= MAX_WEIGHT) {
          String payload = "{\"weight\": " + String(weight, 2) + ", \"timestamp\": " + String(millis()) + "}";

          if (client.publish(weightTopic, payload.c_str())) {
            Serial.println("Published weight to AWS IoT!");
          } else {
            Serial.println("Publish failed.");
          }
        } else if (weight < WEIGHT_THRESHOLD) {
          Serial.println("No significant weight detected.");
          String payload = "{\"weight\": 0, \"message\": \"no_weight\", \"timestamp\": " + String(millis()) + "}";
          client.publish(weightTopic, payload.c_str());
        } else {
          Serial.println("Weight reading out of valid range.");
        }
      } else {
        Serial.println("Failed to get valid weight reading.");
      }
    } else if (incoming == "tare") {
      // Manual tare command
      Serial.println("Taring scale...");
      scale.tare(20); // Average of 20 readings for tare
      Serial.println("Scale tared successfully.");
      
      String response = "{\"message\": \"scale_tared\", \"timestamp\": " + String(millis()) + "}";
      client.publish(weightTopic, response.c_str());
    } else if (incoming == "calibrate") {
      // Calibration mode - you'd need to add a known weight
      Serial.println("Calibration requested - place known weight and send calibration value");
    }
  }
}

// === MQTT Connect ===
void mqttConnect() {
  while (!client.connected()) {
    Serial.print("Connecting to AWS IoT...");
    String clientId = "ESP8266Client_" + String(WiFi.macAddress());
    
    if (client.connect(clientId.c_str())) {
      Serial.println("connected!");
      client.subscribe(checkoutRequestTopic);
      Serial.println("Subscribed to checkout topic");
    } else {
      Serial.printf("failed, rc=%d. Retrying in 5 seconds...\n", client.state());
      delay(5000);
      yield();
    }
  }
}

// === Scale Initialization and Calibration ===
void initializeScale() {
  Serial.println("Initializing load cell...");
  scale.begin(DOUT, CLK);
  
  // Wait for scale to be ready
  int attempts = 0;
  while (!scale.is_ready() && attempts < 10) {
    delay(500);
    attempts++;
    Serial.print(".");
  }
  
  if (scale.is_ready()) {
    Serial.println("\nLoad cell hardware ready");
    
    // Set calibration factor
    scale.set_scale(calibration_factor);
    
    // Perform initial tare with multiple readings
    Serial.println("Performing initial tare (remove all weight)...");
    delay(2000); // Give time to remove weight
    
    scale.tare(20); // Average of 20 readings for better accuracy
    
    Serial.println("Scale tared successfully");
    Serial.print("Calibration factor: ");
    Serial.println(calibration_factor);
    
    // Test reading
    delay(1000);
    float testWeight = getFilteredWeight();
    Serial.print("Test reading after tare: ");
    Serial.print(testWeight);
    Serial.println(" g");
    
    if (abs(testWeight) > 10) {
      Serial.println("WARNING: Scale may need re-calibration or re-taring");
    }
    
  } else {
    Serial.println("\nLoad cell initialization failed!");
  }
}

// === Setup ===
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== ESP8266 Load Cell System Starting ===");

  // Initialize scale first
  initializeScale();

  connectWiFi();
  
  if (WiFi.status() == WL_CONNECTED) {
    syncTime();
    loadCertificates();
    
    client.setServer(awsEndpoint, 8883);
    client.setCallback(mqttCallback);
  }

  Serial.println("Setup complete. System ready.");
  Serial.println("Commands: Send 'checkout' to measure, 'tare' to zero scale");
}

// === Loop ===
void loop() {
  // Handle MQTT connection
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      mqttConnect();
    }
    client.loop();
  }

  // Monitor weight and provide feedback every 10 seconds
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint > 10000) {
    float weight = getFilteredWeight();
    if (weight >= 0) {
      Serial.print("Current weight: ");
      Serial.print(weight);
      Serial.print(" g");
      
      if (weight < WEIGHT_THRESHOLD) {
        Serial.println(" (below threshold)");
      } else if (isWeightStable(weight)) {
        Serial.println(" (stable)");
      } else {
        Serial.println(" (changing)");
      }
    } else {
      Serial.println("Scale reading error");
    }
    lastPrint = millis();
  }

  delay(100);
  yield();
}