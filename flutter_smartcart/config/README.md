This directory is intended for configuration files and certificates used at runtime by the firmware.

Files:
------

1. emqx.env  
   - Stores Wi-Fi and EMQX MQTT credentials in key=value format.  
   - Example:  
       WIFI_SSID=YourSSID  
       WIFI_PASSWORD=YourPassword  
       MQTT_SERVER=your-emqx-server.com  
       MQTT_PORT=8883  
       MQTT_USER=your_mqtt_username  
       MQTT_PASS=your_mqtt_password  
       MQTT_TOPIC=smart_cart/position  

2. emqxsl-ca.crt  
   - The CA certificate used for EMQX TLS connection.

How to Use:
-----------

- Modify `emqx.env` with your correct EMQX credentials (except the `MQTT_TOPIC`, which is predefined).
- Ensure this file and the CA certificate match those used by the IoT device that sends MPU6050 position data.
- Place the CA certificate from EMQX Cloud into `emqxsl-ca.crt`.
- The contents of this directory are meant for desktop apps only (incase you run the flutter app on desktop).

Notes:
------

- This is the same emqx.env file used for sending the positon data to the MQTT broker
- Therefore, not all the data in the emqx.env file here is required for the desktop app (eg: WIFI_SSID, WIFI_PASSWORD)
