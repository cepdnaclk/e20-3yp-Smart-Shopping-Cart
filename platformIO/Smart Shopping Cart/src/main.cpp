#include <Arduino.h>    // This includes FreeRTOS and other Arduino functionality
#include "wifi.h" 


void setup() {
    // Initialize serial communication at 115200 baud rate
    Serial.begin(115200);
    Serial.println("Hello, Smart Shopping Cart!");

    // Set GPIO2 (D4 on many boards) as output
    pinMode(2, OUTPUT);

    setupWiFi();
}

void loop() {
    // Turn the LED connected to GPIO2 on
    digitalWrite(2, HIGH);
    Serial.println("GPIO2 is HIGH");
    delay(1000);  // Wait for 1 second

    // Turn the LED connected to GPIO2 off
    digitalWrite(2, LOW);
    Serial.println("GPIO2 is LOW");
    delay(1000);  // Wait for 1 second
}

