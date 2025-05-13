#include "rfid_handler.h"
#include <SPI.h>
#include <MFRC522.h>
#include "mqtt_handler.h" // For access to `client`

#define SS_PIN D2
#define RST_PIN D1
#define BUZZER_PIN D8

MFRC522 mfrc522(SS_PIN, RST_PIN);

void initRFID()
{
    Serial.println("🔄 Initializing RFID...");
    SPI.begin(); // or SPI.begin(D5, D6, D7, D2) explicitly
    mfrc522.PCD_Init();
    delay(100);
    Serial.println("✅ RFID ready. Scan a tag...");
}

void initBuzzer()
{
    pinMode(BUZZER_PIN, OUTPUT);
    digitalWrite(BUZZER_PIN, LOW);
}

void checkRFIDTag()
{
    if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial())
        return;

    String tag = "";
    for (byte i = 0; i < mfrc522.uid.size; i++)
    {
        tag += String(mfrc522.uid.uidByte[i], HEX);
    }
    tag.toUpperCase();

    Serial.print("📟 Tag detected: ");
    Serial.println(tag);

    String payload = "{\"tag\": \"" + tag + "\"}";
    if (getMQTTClient().publish("smartcart/payment", payload.c_str()))
    {
        Serial.println("📤 Tag published to MQTT.");
    }
    else
    {
        Serial.println("⚠️ Failed to publish tag.");
    }

    delay(1500);
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
}

void buzzBuzzer()
{
    Serial.println("🔔 buzzBuzzer() CALLED");
    digitalWrite(BUZZER_PIN, HIGH); // Turn on the buzzer
    delay(1000);                    // Wait for 1 second
    digitalWrite(BUZZER_PIN, LOW);  // Turn off the buzzer
}