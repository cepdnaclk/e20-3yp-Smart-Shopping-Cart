#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "wifi.h"  // Include the header file for the Wi-Fi code

const char* ssid = "Eng-Student";  // Replace with your Wi-Fi SSID
const char* password = "3nG5tuDt";  // Replace with your Wi-Fi password

void setupWiFi() {
  // Start Serial Monitor at 115200 baud rate
  Serial.begin(115200);
  delay(10);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  // Once connected
  Serial.println("");
  Serial.println("WiFi connected");

  // Print the IP address
  Serial.println(WiFi.localIP());

  // Make HTTP GET request to the test server
  HTTPClient http;
  WiFiClient client;  // Create a WiFiClient object
  String serverPath = "http://jsonplaceholder.typicode.com/posts/1";  // Test server URL

  http.begin(client, serverPath);  // Start the connection to the server using WiFiClient
  int httpCode = http.GET();  // Make the GET request

  if (httpCode > 0) {  // Check if the request was successful
    Serial.print("HTTP Response code: ");
    Serial.println(httpCode);
    String payload = http.getString();  // Get the response payload (body)
    Serial.println(payload);  // Print the response
  } else {
    Serial.print("Error on HTTP request: ");
    Serial.println(httpCode);
  }

  http.end();  // Close the connection
}
