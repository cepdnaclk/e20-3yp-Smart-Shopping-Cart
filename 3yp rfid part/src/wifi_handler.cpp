#include "wifi_handler.h"
#include <ESP8266WiFi.h>
#include <time.h>

const char *ssid = "Don";
const char *password = "Don636201065@";

void connectWiFi()
{
    Serial.print("Connecting to WiFi SSID: ");
    Serial.println(ssid);

    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    int attempt = 0;
    while (WiFi.status() != WL_CONNECTED && attempt < 30)
    {
        delay(500);
        Serial.print(".");
        attempt++;
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("\nWiFi connected successfully!");
        Serial.print("ESP IP Address: ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println("\nFailed to connect to WiFi.");
    }
}

void syncTime()
{
    configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    Serial.print("Synchronizing NTP time");
    time_t now = time(nullptr);
    int attempts = 0;
    while (now < 8 * 3600 * 2 && attempts < 30)
    {
        delay(500);
        Serial.print(".");
        now = time(nullptr);
        attempts++;
    }

    if (attempts < 30)
    {
        Serial.println("\nTime synchronized!");
    }
    else
    {
        Serial.println("\nTime synchronization failed!");
    }
}
