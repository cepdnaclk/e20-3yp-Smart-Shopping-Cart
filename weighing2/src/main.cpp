#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <HX711.h>

// WiFi
const char* ssid = "TCL";
const char* password = "12345678";

// Firebase
#define API_KEY "AIzaSyCjjD2t-cdSxyNN8zTEKc9-50pta6eleFs"
#define DATABASE_URL "https://smart-shopping-cart-481c7-default-rtdb.firebaseio.com/"
FirebaseConfig config;
FirebaseAuth auth;
FirebaseData fbdo;

// HX711
#define DOUT D2
#define CLK D1
HX711 scale;
float calibration_factor = 937.38;
const float WEIGHT_THRESHOLD = 5.0;

float lastWeight = 0;
unsigned long lastUpdate = 0;
const unsigned long UPDATE_INTERVAL = 1000;
const char* cartId = "cart001";

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(300);
}

void setupFirebase() {
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = nullptr;

  Firebase.reconnectWiFi(true);
  Firebase.begin(&config, &auth);
  Firebase.signUp(&config, &auth, "", "");
}

float getFilteredWeight() {
  if (!scale.is_ready()) return -1;
  float total = 0; int valid = 0;
  for (int i = 0; i < 10; i++) {
    if (scale.wait_ready_timeout(200)) {
      total += scale.get_units(1);
      valid++;
    }
    yield();
  }
  if (valid < 5) return -1;
  float avg = total / valid;
  return (abs(avg) < WEIGHT_THRESHOLD) ? 0.0 : avg;
}

void publishWeight(float weight) {
  fbdo.setBSSLBufferSize(512, 256);
  char path[50];
  snprintf(path, sizeof(path), "/carts/%s/weight", cartId);
  if (Firebase.setFloat(fbdo, path, weight)) {
    Serial.printf("Published weight: %.2f\n", weight);
  } else {
    Serial.printf("Firebase publish failed: %s\n", fbdo.errorReason().c_str());
  }
}


void setup() {
  Serial.begin(115200);
  scale.begin(DOUT, CLK);
  scale.set_scale(calibration_factor);
  scale.tare();

  connectWiFi();
  setupFirebase();
}

void loop() {
  unsigned long now = millis();
  if (now - lastUpdate >= UPDATE_INTERVAL) {
    float w = getFilteredWeight();
    if (w >= 0 && abs(w - lastWeight) > 1.0) {
      publishWeight(w);
      lastWeight = w;
    }
    lastUpdate = now;
  }
  delay(10);
  ESP.wdtFeed();
}
