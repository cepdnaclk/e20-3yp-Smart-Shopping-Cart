#ifndef MQTT_HANDLER_H
#define MQTT_HANDLER_H

#include <PubSubClient.h>
#include <WiFiClientSecureBearSSL.h>

// Expose the secure client used for MQTT
extern BearSSL::WiFiClientSecure espClient;

// Setup functions
void setupMQTT();
void handleMQTT();
void loadCertificates();

// Returns reference to global MQTT client
PubSubClient &getMQTTClient();

#endif
