#ifndef EMQX_IOT_H
#define EMQX_IOT_H

#include <Arduino.h>

bool emqx_iot_setup();
void emqx_iot_loop();
void publish_position(float x, float y, float z);

#endif // EMQX_IOT_H
