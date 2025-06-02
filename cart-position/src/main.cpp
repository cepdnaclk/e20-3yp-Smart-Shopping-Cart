#include <Wire.h>
#include <MPU6050.h>
#include <math.h>
#include <emqx_iot.h>

MPU6050 mpu;

// Position variables (m)
float px = 0, py = 0, pz = 0;

// Update px, py, pz from MPU6050
extern float px, py, pz;

unsigned long lastTime = 0;
unsigned long lastLogTime = 0;
const int logInterval = 1000;

// Calibration offsets
int32_t gx_offset = 0, gy_offset = 0, gz_offset = 0;
int32_t ax_offset = 0, ay_offset = 0, az_offset = 0;
const int CALIB_SAMPLES = 1000;

// Quaternion state: [w, x, y, z]
float q[4] = {1, 0, 0, 0};

// EKF tuning parameters
float alpha = 0.02; // accelerometer correction strength

// Velocity (m/s)
float vx = 0, vy = 0, vz = 0;

// Threshold to reduce noise
const float accel_threshold = 0.05;

void normalizeQuaternion(float *q)
{
  float norm = sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);
  if (norm > 0)
  {
    for (int i = 0; i < 4; i++)
      q[i] /= norm;
  }
}

void updateQuaternionWithGyro(float gx, float gy, float gz, float dt)
{
  float qDot[4];
  qDot[0] = 0.5 * (-q[1] * gx - q[2] * gy - q[3] * gz);
  qDot[1] = 0.5 * (q[0] * gx + q[2] * gz - q[3] * gy);
  qDot[2] = 0.5 * (q[0] * gy - q[1] * gz + q[3] * gx);
  qDot[3] = 0.5 * (q[0] * gz + q[1] * gx - q[2] * gy);

  for (int i = 0; i < 4; i++)
    q[i] += qDot[i] * dt;
  normalizeQuaternion(q);
}

void correctQuaternionWithAccel(float ax, float ay, float az)
{
  float norm = sqrt(ax * ax + ay * ay + az * az);
  if (norm == 0)
    return;
  ax /= norm;
  ay /= norm;
  az /= norm;

  float gx = 2 * (q[1] * q[3] - q[0] * q[2]);
  float gy = 2 * (q[0] * q[1] + q[2] * q[3]);
  float gz = q[0] * q[0] - q[1] * q[1] - q[2] * q[2] + q[3] * q[3];

  float ex = (ay * gz - az * gy);
  float ey = (az * gx - ax * gz);
  float ez = (ax * gy - ay * gx);

  float correction = alpha;
  q[0] -= correction * (q[1] * ex + q[2] * ey + q[3] * ez);
  q[1] += correction * (q[0] * ex + q[2] * ez - q[3] * ey);
  q[2] += correction * (q[0] * ey - q[1] * ez + q[3] * ex);
  q[3] += correction * (q[0] * ez + q[1] * ex - q[2] * ey);

  normalizeQuaternion(q);
}

void calibrateSensors()
{
  int16_t ax_raw, ay_raw, az_raw, gx, gy, gz;
  ax_offset = ay_offset = az_offset = 0;
  gx_offset = gy_offset = gz_offset = 0;

  Serial.println("Calibrating...");
  delay(2000);
  for (int i = 0; i < CALIB_SAMPLES; i++)
  {
    mpu.getMotion6(&ax_raw, &ay_raw, &az_raw, &gx, &gy, &gz);
    ax_offset += ax_raw;
    ay_offset += ay_raw;
    az_offset += (az_raw - 16384); // account for gravity
    gx_offset += gx;
    gy_offset += gy;
    gz_offset += gz;
    delay(2);
  }

  ax_offset /= CALIB_SAMPLES;
  ay_offset /= CALIB_SAMPLES;
  az_offset /= CALIB_SAMPLES;
  gx_offset /= CALIB_SAMPLES;
  gy_offset /= CALIB_SAMPLES;
  gz_offset /= CALIB_SAMPLES;
}

const float G = 9.81; // m/s^2 gravity

void setup()
{
  Serial.begin(115200);
  if (!emqx_iot_setup())
  {
    Serial.println("EMQX IoT setup failed!");
    while (1)
      delay(1000);
  }

  Wire.begin();
  mpu.initialize();
  mpu.setFullScaleGyroRange(MPU6050_GYRO_FS_250);
  mpu.setFullScaleAccelRange(MPU6050_ACCEL_FS_2);

  if (!mpu.testConnection())
  {
    Serial.println("MPU6050 connection failed!");
    while (1)
      ;
  }

  calibrateSensors();
  lastTime = millis();
}

void loop()
{
  int16_t ax_raw, ay_raw, az_raw, gx_raw, gy_raw, gz_raw;
  mpu.getMotion6(&ax_raw, &ay_raw, &az_raw, &gx_raw, &gy_raw, &gz_raw);

  float ax = (ax_raw - ax_offset) / 16384.0f;
  float ay = (ay_raw - ay_offset) / 16384.0f;
  float az = (az_raw - az_offset) / 16384.0f;

  float gx_dps = (gx_raw - gx_offset) / 131.0f;
  float gy_dps = (gy_raw - gy_offset) / 131.0f;
  float gz_dps = (gz_raw - gz_offset) / 131.0f;

  float gx = gx_dps * (M_PI / 180.0f);
  float gy = gy_dps * (M_PI / 180.0f);
  float gz = gz_dps * (M_PI / 180.0f);

  unsigned long now = millis();
  float dt = (now - lastTime) / 1000.0f;
  if (dt <= 0)
    dt = 0.001f;
  lastTime = now;

  updateQuaternionWithGyro(gx, gy, gz, dt);
  correctQuaternionWithAccel(ax, ay, az);

  // Gravity in world frame (0, 0, 1)
  gx = 2 * (q[1] * q[3] - q[0] * q[2]);
  gy = 2 * (q[0] * q[1] + q[2] * q[3]);
  gz = q[0] * q[0] - q[1] * q[1] - q[2] * q[2] + q[3] * q[3];

  // Subtract gravity from acceleration (still in body frame)
  float acc_body[3] = {
      ax - gx,
      ay - gy,
      az - gz};

  // Rotate linear acceleration from body frame to world frame using quaternion
  float qw = q[0], qx = q[1], qy = q[2], qz = q[3];
  float acc_world[3];
  acc_world[0] = (1 - 2 * qy * qy - 2 * qz * qz) * acc_body[0] + 2 * (qx * qy - qw * qz) * acc_body[1] + 2 * (qx * qz + qw * qy) * acc_body[2];
  acc_world[1] = 2 * (qx * qy + qw * qz) * acc_body[0] + (1 - 2 * qx * qx - 2 * qz * qz) * acc_body[1] + 2 * (qy * qz - qw * qx) * acc_body[2];
  acc_world[2] = 2 * (qx * qz - qw * qy) * acc_body[0] + 2 * (qy * qz + qw * qx) * acc_body[1] + (1 - 2 * qx * qx - 2 * qy * qy) * acc_body[2];

  // Apply threshold
  for (int i = 0; i < 3; i++)
  {
    if (fabs(acc_world[i]) < accel_threshold)
      acc_world[i] = 0;
  }

  // Integrate acceleration to velocity
  vx += acc_world[0] * G * dt;
  vy += acc_world[1] * G * dt;
  vz += acc_world[2] * G * dt;

  float damping = 0.995;
  vx *= damping;
  vy *= damping;
  vz *= damping;

  // Integrate velocity to get position
  px += vx * dt;
  py += vy * dt;
  pz += vz * dt;
  if (now - lastLogTime > logInterval)
  {
    lastLogTime = now;
    // Log to Serial
    Serial.print("{\"x\":");
    Serial.print(px, 4);
    Serial.print(",\"y\":");
    Serial.print(py, 4);
    Serial.print(",\"z\":");
    Serial.print(pz, 4);
    Serial.println("}");
    
    // Publish to MQTT
    publish_position(px, py, pz);
  }
  emqx_iot_loop();
}
