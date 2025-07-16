#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <WiFiClientSecureBearSSL.h>
#include <PubSubClient.h>
#include <LittleFS.h>
#include <SoftwareSerial.h>
#include <HX711.h>
#include <time.h>

// ========== WiFi ==========
const char* ssid = "TCL";
const char* password = "12345678";

// ========== Firebase ==========
#define API_KEY "AIzaSyCjjD2t-cdSxyNN8zTEKc9-50pta6eleFs"
#define DATABASE_URL "https://smart-shopping-cart-481c7-default-rtdb.firebaseio.com/"
FirebaseConfig config;
FirebaseAuth auth;

// ========== AWS ==========
const char* awsEndpoint = "apgkm0fe4pifa-ats.iot.us-east-1.amazonaws.com";
const char* barcodeTopic = "products/barcode/cart001";
BearSSL::WiFiClientSecure espClient;
PubSubClient client(espClient);
BearSSL::X509List* client_crt = nullptr;
BearSSL::PrivateKey* client_key = nullptr;
BearSSL::X509List* ca_cert = nullptr;

// ========== Load Cell ==========
#define DOUT D2
#define CLK D1
HX711 scale;
float calibration_factor = 1028.67;
const float WEIGHT_THRESHOLD = 5.0;

// ========== Barcode Scanner ==========
SoftwareSerial scannerSerial(D5, D6); // RX, TX

// ========== Variables ==========
float lastWeight = 0;
unsigned long lastUpdate = 0;
const unsigned long UPDATE_INTERVAL = 1000; // 1 second
const char* cartId = "cart001";

// ========== WiFi ==========
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
}

// ========== NTP Sync ==========
void syncTime() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  time_t now = time(nullptr);
  while (now < 1600000000) {
    delay(200);
    now = time(nullptr);
  }
}

// ========== AWS Certs ==========
bool loadCertificates() {
  if (!LittleFS.begin()) return false;

  File certFile = LittleFS.open("/certificate.pem.crt", "r");
  File keyFile = LittleFS.open("/private.pem.key", "r");
  File caFile = LittleFS.open("/AmazonRootCA1.pem", "r");

  if (!certFile || !keyFile || !caFile) {
    LittleFS.end();
    return false;
  }

  if (client_crt) delete client_crt;
  if (client_key) delete client_key;
  if (ca_cert) delete ca_cert;

  client_crt = new BearSSL::X509List(certFile);
  client_key = new BearSSL::PrivateKey(keyFile);
  ca_cert = new BearSSL::X509List(caFile);

  certFile.close(); keyFile.close(); caFile.close();
  LittleFS.end();

  espClient.setClientRSACert(client_crt, client_key);
  espClient.setTrustAnchors(ca_cert);
  return true;
}

// ========== MQTT ==========
void mqttConnect() {
  client.setServer(awsEndpoint, 8883);
  client.setBufferSize(256);
  int retries = 0;

  while (!client.connected() && retries < 3) {
    if (client.connect("ESP8266Client")) {
      break;
    } else {
      delay(2000);
      retries++;
    }
  }

  if (retries >= 3) {
    ESP.restart();  // Reset if failed to connect after 3 tries
  }
}

// ========== Firebase ==========
void setupFirebase() {
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = nullptr;

  Firebase.reconnectWiFi(true);
  Firebase.begin(&config, &auth);
  Firebase.signUp(&config, &auth, "", "");
}

// ========== Weight Read ==========
float getFilteredWeight() {
  if (!scale.is_ready()) return -1;

  float total = 0;
  int valid = 0;

  for (int i = 0; i < 10; i++) {
    if (scale.wait_ready_timeout(200)) {
      float w = scale.get_units(1);
      total += w;
      valid++;
    }
    yield();
  }

  if (valid < 5) return -1;

  float avg = total / valid;
  return (abs(avg) < WEIGHT_THRESHOLD) ? 0.0 : avg;
}

// ========== Firebase Upload ==========
void publishWeightToFirebase(float weight) {
  FirebaseData fbdo;
  fbdo.setBSSLBufferSize(512, 256);

  char path[50];
  snprintf(path, sizeof(path), "/carts/%s/weight", cartId);

  Firebase.setFloat(fbdo, path, weight);
}

// ========== Setup ==========
void setup() {
  Serial.begin(115200);
  scannerSerial.begin(9600);

  scale.begin(DOUT, CLK);
  scale.set_scale(calibration_factor);
  scale.tare();

  connectWiFi();
  syncTime();

  setupFirebase();

  if (!loadCertificates()) {
    espClient.setInsecure();  // fallback
  }

  mqttConnect();
}

// ========== Loop ==========
void loop() {
  if (!client.connected()) mqttConnect();
  client.loop();

  // Barcode scan
  if (scannerSerial.available()) {
    char barcode[32] = {0};
    scannerSerial.readBytesUntil('\n', barcode, sizeof(barcode) - 1);

    if (strlen(barcode) > 0) {
      char payload[100];
      snprintf(payload, sizeof(payload), "{\"barcode\": \"%s\"}", barcode);
      client.publish(barcodeTopic, payload);
    }
  }

  // Weight read and send every 1s
  unsigned long now = millis();
  if (now - lastUpdate >= UPDATE_INTERVAL) {
    float w = getFilteredWeight();
    if (w >= 0 && abs(w - lastWeight) > 1.0) {
      publishWeightToFirebase(w);
      lastWeight = w;
    }
    lastUpdate = now;
  }

  delay(10);
  ESP.wdtFeed();
}
