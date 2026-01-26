/*
 * Wiring:
 * ADS1115 -> ESP32:
 *   VDD -> 3.3V
 *   GND -> GND
 *   SCL -> GPIO22
 *   SDA -> GPIO21
 * 
 * ADXL335 Sensor A (Sensor 1):
 *   Z -> ADS1115 A0
 *   Y -> ADS1115 A1
 *   X -> Not connected (displays 0)
 * 
 * ADXL335 Sensor B (Sensor 2):
 *   Z -> ADS1115 A2
 *   Y -> ADS1115 A3 (Assumed for 'Sensor 4 A4' request)
 *   X -> Not connected (displays 0)
 * 
 * Required Libraries (install via Arduino Library Manager):
 * - PubSubClient by Nick O'Leary
 * - WiFiClientSecure (built-in with ESP32)
 * - Adafruit ADS1X15 by Adafruit
 * - ArduinoJson by Benoit Blanchon
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>

// ============= WIFI CONFIGURATION =============
const char* ssid = "test";
const char* password = "12345678";

// ============= HIVEMQ CLOUD CONFIGURATION =============
const char* mqtt_server = "8102284b29c24b4eb40e06ac182d1130.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "lathika";
const char* mqtt_password = "Lathika2002";

// MQTT Topics
const char* topic_sensorA = "trainflow/sensor/A";
const char* topic_sensorB = "trainflow/sensor/B";
const char* topic_status = "trainflow/status";

// HiveMQ Cloud Root CA Certificate
const char* root_ca = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
)EOF";

// ============= SENSOR CONFIGURATION =============
const float SAMPLE_RATE = 50.0;  // 50 Hz sampling rate

// ADXL335 Specifications
const float VCC = 3.3;                    // Supply voltage
const float ZERO_G_VOLTAGE = 1.65;        // Voltage at 0g (VCC/2)
const float SENSITIVITY = 0.33;           // 330mV/g for ADXL335

// ADS1115 Configuration
const float ADS_GAIN_VOLTAGE = 4.096;     // Using GAIN_ONE (±4.096V range)
const float ADS_MAX_VALUE = 32767.0;      // 16-bit signed max value

// ADS1115 Object
Adafruit_ADS1115 ads;
bool adsConnected = false;

// Train detection state
String trainPhase = "idle";
String trainDirection = "";
float trainSpeed = 0;
bool trainDetected = false;
unsigned long trainStartTime = 0;
unsigned long lastPublishTime = 0;

// Threshold for train detection (adjust based on your setup)
const float VIBRATION_THRESHOLD = 0.15;  // g-force threshold for train detection
const float NOISE_THRESHOLD = 0.05;      // Below this is considered noise

// Moving average for noise filtering
#define FILTER_SAMPLES 5
float xA_samples[FILTER_SAMPLES] = {0};
float yA_samples[FILTER_SAMPLES] = {0};
float zA_samples[FILTER_SAMPLES] = {0};
float xB_samples[FILTER_SAMPLES] = {0};
float yB_samples[FILTER_SAMPLES] = {0};
float zB_samples[FILTER_SAMPLES] = {0};
int sampleIndex = 0;

// WiFi and MQTT clients
WiFiClientSecure espClient;
PubSubClient client(espClient);

// ============= HELPER FUNCTIONS =============

// Convert ADS1115 raw value to voltage
float adsToVoltage(int16_t rawValue) {
  return (rawValue * ADS_GAIN_VOLTAGE) / ADS_MAX_VALUE;
}

// Convert voltage to g-force for ADXL335
float voltageToG(float voltage) {
  return (voltage - ZERO_G_VOLTAGE) / SENSITIVITY;
}

// Apply moving average filter
float applyFilter(float newValue, float* samples) {
  samples[sampleIndex] = newValue;
  float sum = 0;
  for (int i = 0; i < FILTER_SAMPLES; i++) {
    sum += samples[i];
  }
  return sum / FILTER_SAMPLES;
}

// Read sensor data from ADS1115
void readSensors(float* xA, float* yA, float* zA, float* xB, float* yB, float* zB) {
  if (!adsConnected) {
    // If ADS1115 not connected, return zeros
    *xA = 0; *yA = 0; *zA = 0;
    *xB = 0; *yB = 0; *zB = 0;
    return;
  }
  
  // Read all 4 channels from ADS1115
  int16_t rawA0 = ads.readADC_SingleEnded(0);  // Sensor A - Z (A0)
  int16_t rawA1 = ads.readADC_SingleEnded(1);  // Sensor A - Y (A1)
  int16_t rawA2 = ads.readADC_SingleEnded(2);  // Sensor B - Z (A2)
  int16_t rawA3 = ads.readADC_SingleEnded(3);  // Sensor B - Y (A3 assumed)
  
  // Convert to voltage
  float voltA0 = adsToVoltage(rawA0);
  float voltA1 = adsToVoltage(rawA1);
  float voltA2 = adsToVoltage(rawA2);
  float voltA3 = adsToVoltage(rawA3);
  
  // Convert to g-force
  float rawZA = voltageToG(voltA0);  // A0 -> Z
  float rawYA = voltageToG(voltA1);  // A1 -> Y
  float rawZB = voltageToG(voltA2);  // A2 -> Z
  float rawYB = voltageToG(voltA3);  // A3 -> Y
  
  // Apply moving average filter
  *zA = applyFilter(rawZA, zA_samples);
  *yA = applyFilter(rawYA, yA_samples);
  *zB = applyFilter(rawZB, zB_samples);
  *yB = applyFilter(rawYB, yB_samples);
  
  // X axis not connected - display 0
  *xA = 0.0;
  *xB = 0.0;
  
  // Update sample index for moving average
  sampleIndex = (sampleIndex + 1) % FILTER_SAMPLES;
}

// Convert g-force to raw value for compatibility with dashboard
float gToRaw(float gForce) {
  // Scale g-force to match the dashboard's expected range
  // Original simulator used values up to 60000
  return gForce * 20000.0;
}

// Convert g-force back to voltage for display
float gToVoltage(float gForce) {
  return ZERO_G_VOLTAGE + (gForce * SENSITIVITY);
}

// Detect train based on vibration magnitude
void detectTrain(float magnitudeA, float magnitudeB) {
  float avgMagnitude = (magnitudeA + magnitudeB) / 2.0;
  
  static unsigned long aboveThresholdStart = 0;
  static unsigned long belowThresholdStart = 0;
  
  if (avgMagnitude > VIBRATION_THRESHOLD) {
    belowThresholdStart = 0;
    
    if (aboveThresholdStart == 0) {
      aboveThresholdStart = millis();
    }
    
    // Train detected after sustained vibration (500ms)
    if (!trainDetected && (millis() - aboveThresholdStart > 500)) {
      trainDetected = true;
      trainPhase = "passing";
      trainDirection = "detected";
      trainSpeed = avgMagnitude * 100;  // Estimate speed from magnitude
      trainStartTime = millis();
      Serial.println(">>> TRAIN DETECTED! <<<");
    }
  } else if (avgMagnitude < NOISE_THRESHOLD) {
    aboveThresholdStart = 0;
    
    if (trainDetected && belowThresholdStart == 0) {
      belowThresholdStart = millis();
    }
    
    // Train departed after vibration stops (1 second)
    if (trainDetected && (millis() - belowThresholdStart > 1000)) {
      trainDetected = false;
      trainPhase = "idle";
      trainDirection = "";
      trainSpeed = 0;
      Serial.println("Train departed.");
    }
  }
}

// ============= WIFI SETUP =============
void setupWiFi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("");
    Serial.println("WiFi connection failed!");
  }
}

// ============= ADS1115 SETUP =============
void setupADS1115() {
  Serial.println("Initializing ADS1115...");
  
  Wire.begin(21, 22);  // SDA, SCL for ESP32
  
  if (ads.begin()) {
    adsConnected = true;
    Serial.println("ADS1115 connected!");
    
    // Set gain to GAIN_ONE for ±4.096V range
    // This gives us good resolution for 0-3.3V ADXL335 output
    ads.setGain(GAIN_ONE);
    
    Serial.println("ADS1115 configured with GAIN_ONE (±4.096V)");
  } else {
    adsConnected = false;
    Serial.println("ERROR: ADS1115 not found! Check wiring:");
    Serial.println("  - VDD to 3.3V");
    Serial.println("  - GND to GND");
    Serial.println("  - SDA to GPIO21");
    Serial.println("  - SCL to GPIO22");
    Serial.println("  - ADDR to GND (for address 0x48)");
  }
}

// ============= MQTT CALLBACK =============
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received [");
  Serial.print(topic);
  Serial.print("]: ");
  
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);
}

// ============= MQTT RECONNECT =============
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    String clientId = "ESP32-TrainFlow-" + String(random(1000, 9999));
    
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected!");
      
      // Subscribe to command topic
      client.subscribe("trainflow/command");
      
      // Publish online status
      StaticJsonDocument<150> statusDoc;
      statusDoc["device"] = "ESP32";
      statusDoc["status"] = "online";
      statusDoc["ip"] = WiFi.localIP().toString();
      statusDoc["mode"] = "real_sensors";
      statusDoc["adsConnected"] = adsConnected;
      
      char statusBuffer[150];
      serializeJson(statusDoc, statusBuffer);
      client.publish(topic_status, statusBuffer);
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" - retrying in 5 seconds");
      delay(5000);
    }
  }
}

// ============= PUBLISH SENSOR DATA =============
void publishSensorData() {
  float xA, yA, zA, xB, yB, zB;
  
  // Read real sensor data
  readSensors(&xA, &yA, &zA, &xB, &yB, &zB);
  
  // Calculate magnitude (using Z and Y, since X is 0)
  float magnitudeA = sqrt(zA*zA + yA*yA);
  float magnitudeB = sqrt(zB*zB + yB*yB);
  
  // Detect train based on vibration
  detectTrain(magnitudeA, magnitudeB);
  
  // Convert g-force to raw values for dashboard compatibility
  float rawXA = gToRaw(xA); // 0
  float rawYA = gToRaw(yA);
  float rawZA = gToRaw(zA);
  float rawXB = gToRaw(xB); // 0
  float rawYB = gToRaw(yB);
  float rawZB = gToRaw(zB);
  
  float rawMagnitudeA = sqrt(rawXA*rawXA + rawYA*rawYA + rawZA*rawZA);
  float rawMagnitudeB = sqrt(rawXB*rawXB + rawYB*rawYB + rawZB*rawZB);
  
  // Create JSON for Sensor A
  StaticJsonDocument<350> docA;
  docA["timestamp"] = millis();
  docA["x"] = rawXA;  // 0
  docA["y"] = rawYA;
  docA["z"] = rawZA;
  docA["magnitude"] = rawMagnitudeA;
  
  // Include g-force values for reference
  JsonObject gForceA = docA.createNestedObject("gForce");
  gForceA["x"] = xA;
  gForceA["y"] = yA;
  gForceA["z"] = zA;
  
  JsonObject voltageA = docA.createNestedObject("voltage");
  voltageA["x"] = gToVoltage(xA);
  voltageA["y"] = gToVoltage(yA);
  voltageA["z"] = gToVoltage(zA);
  
  char bufferA[350];
  serializeJson(docA, bufferA);
  client.publish(topic_sensorA, bufferA);
  
  // Create JSON for Sensor B
  StaticJsonDocument<350> docB;
  docB["timestamp"] = millis();
  docB["x"] = rawXB;  // 0
  docB["y"] = rawYB;
  docB["z"] = rawZB;
  docB["magnitude"] = rawMagnitudeB;
  
  JsonObject gForceB = docB.createNestedObject("gForce");
  gForceB["x"] = xB;
  gForceB["y"] = yB;
  gForceB["z"] = zB;
  
  JsonObject voltageB = docB.createNestedObject("voltage");
  voltageB["x"] = gToVoltage(xB);
  voltageB["y"] = gToVoltage(yB);
  voltageB["z"] = gToVoltage(zB);
  
  char bufferB[350];
  serializeJson(docB, bufferB);
  client.publish(topic_sensorB, bufferB);
  
  // Publish train state
  StaticJsonDocument<150> stateDoc;
  stateDoc["phase"] = trainPhase;
  stateDoc["direction"] = trainDirection;
  stateDoc["speed"] = trainSpeed;
  stateDoc["isApproaching"] = trainDetected;
  stateDoc["magnitudeA"] = magnitudeA;
  stateDoc["magnitudeB"] = magnitudeB;
  
  char stateBuffer[150];
  serializeJson(stateDoc, stateBuffer);
  client.publish("trainflow/trainState", stateBuffer);
  
  // Debug output every second
  static unsigned long lastDebug = 0;
  if (millis() - lastDebug > 1000) {
    lastDebug = millis();
    Serial.printf("Sensor A - X: %.3fg (NC), Y: %.3fg, Z: %.3fg | Mag: %.3fg\n", xA, yA, zA, magnitudeA);
    Serial.printf("Sensor B - X: %.3fg (NC), Y: %.3fg, Z: %.3fg | Mag: %.3fg\n", xB, yB, zB, magnitudeB);
    Serial.printf("Train: %s | ADS1115: %s\n", 
                  trainDetected ? "DETECTED" : "none", 
                  adsConnected ? "OK" : "NOT FOUND");
    Serial.println("----------------------------------------");
  }
}

// ============= SETUP =============
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println();
  Serial.println("========================================");
  Serial.println("  TrainFlow ESP32 - Real Sensors");
  Serial.println("  ADS1115 + ADXL335 x2 (Z/Y Axis Mode)");
  Serial.println("========================================");
  Serial.println();
  Serial.println("Wiring Configuration:");
  Serial.println("  ADS1115 A0 <- Sensor 1 Z-axis");
  Serial.println("  ADS1115 A1 <- Sensor 1 Y-axis");
  Serial.println("  ADS1115 A2 <- Sensor 2 Z-axis");
  Serial.println("  ADS1115 A3 <- Sensor 2 Y-axis");
  Serial.println("  X-axis: Not connected (displays 0)");
  Serial.println();
  
  randomSeed(analogRead(0));
  
  // Setup ADS1115
  setupADS1115();
  
  // Setup WiFi
  setupWiFi();
  
  // Setup MQTT with TLS
  espClient.setCACert(root_ca);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setBufferSize(512);
  
  Serial.println();
  Serial.println("Setup complete! Starting real sensor data streaming...");
  Serial.println("========================================");
}

// ============= MAIN LOOP =============
void loop() {
  // Ensure MQTT connection
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Publish at 50Hz (every 20ms)
  unsigned long now = millis();
  if (now - lastPublishTime >= 20) {
    lastPublishTime = now;
    publishSensorData();
  }
}
