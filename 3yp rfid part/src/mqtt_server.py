import mysql.connector
import paho.mqtt.client as mqtt
import json

# === MySQL Connection ===
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",  # Adjust if needed
        database="smartcart"
    )
    cursor = db.cursor()
    print("✅ MySQL connected.")
except Exception as e:
    print("❌ MySQL connection error:", e)
    exit(1)

# === MQTT Callbacks ===
def on_connect(client, userdata, flags, rc):
    print("🔌 Connected to AWS IoT MQTT Broker with code:", rc)
    client.subscribe("smartcart/payment")
    print("📡 Subscribed to topic: smartcart/payment")

def on_message(client, userdata, msg):
    print("📩 Received message:", msg.payload.decode())
    try:
        data = json.loads(msg.payload.decode())
        tag = data.get("tag")

        print("🔍 Checking tag in DB:", tag)
        cursor.execute("SELECT status FROM payment_confirmation WHERE id = %s", (tag,))
        result = cursor.fetchone()

        if result:
            buzz = result[0] == 0  # 0 → Not Paid → Buzzer ON
            print(f"📋 Tag found. Status: {result[0]} → Buzz: {buzz}")
        else:
            buzz = True  # Unknown tag = alert
            print("⚠️ Tag not found in DB. Buzzing!")

        response = json.dumps({"buzz": buzz})
        client.publish("smartcart/response", response)
        print("📤 Response sent:", response)

    except Exception as e:
        print("❌ Error handling message:", e)

# === MQTT Setup for AWS IoT ===
client = mqtt.Client()

# Load TLS certificates from ../data/ relative to this script
client.tls_set(
    ca_certs="../data/AmazonRootCA1.pem",
    certfile="../data/certificate.pem.crt",
    keyfile="../data/private.pem.key"
)
client.tls_insecure_set(False)  # Set to True only for testing

client.on_connect = on_connect
client.on_message = on_message

# Connect to AWS IoT endpoint
try:
    client.connect("ajc4roklp9rho-ats.iot.us-east-1.amazonaws.com", 8883)
    print("🌐 Connecting to AWS IoT MQTT broker...")
except Exception as e:
    print("❌ MQTT connection error:", e)
    exit(1)

# Start MQTT loop
client.loop_forever()
