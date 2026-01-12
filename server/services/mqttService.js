const mqtt = require('mqtt');

let client = null;
let isConnected = false;

// Store for train data received via MQTT
let trainData = {};

// Callback for when messages are received
let messageCallback = null;

const connectMQTT = () => {
    return new Promise((resolve, reject) => {
        // HiveMQ Cloud connection options - loaded inside function to ensure env vars are available
        const options = {
            host: process.env.MQTT_HOST,
            port: parseInt(process.env.MQTT_PORT) || 8883,
            protocol: 'mqtts',
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
            rejectUnauthorized: true
        };

        console.log('Connecting to HiveMQ Cloud...');
        console.log('Host:', options.host);
        console.log('Port:', options.port);
        console.log('Username:', options.username);

        client = mqtt.connect(options);

        client.on('connect', () => {
            console.log('Connected to HiveMQ Cloud successfully!');
            isConnected = true;

            // Subscribe to train-related topics
            client.subscribe('trainflow/#', (err) => {
                if (err) {
                    console.error('Subscription error:', err);
                } else {
                    console.log('Subscribed to trainflow/# topics');
                }
            });

            resolve(client);
        });

        client.on('error', (error) => {
            console.error('MQTT Connection error:', error);
            isConnected = false;
        });

        client.on('close', () => {
            console.log('MQTT Connection closed');
            isConnected = false;
        });

        client.on('reconnect', () => {
            console.log('Attempting to reconnect to MQTT...');
        });

        client.on('message', (topic, message) => {
            const messageStr = message.toString();
            console.log(`MQTT Message received - Topic: ${topic}, Message: ${messageStr}`);

            // Parse and store train data
            try {
                const data = JSON.parse(messageStr);
                trainData[topic] = {
                    data: data,
                    timestamp: new Date().toISOString()
                };

                // Call the message callback if set
                if (messageCallback) {
                    messageCallback(topic, data);
                }
            } catch (e) {
                // If not JSON, store as string
                trainData[topic] = {
                    data: messageStr,
                    timestamp: new Date().toISOString()
                };
            }
        });

        // Set a timeout for initial connection
        setTimeout(() => {
            if (!isConnected) {
                console.log('MQTT connection timeout - will keep trying in background');
                resolve(null);
            }
        }, 10000);
    });
};

// Publish a message to a topic
const publishMessage = (topic, message) => {
    if (!client || !isConnected) {
        console.error('MQTT client not connected');
        return false;
    }

    const messageStr = typeof message === 'object' ? JSON.stringify(message) : message;
    client.publish(topic, messageStr);
    console.log(`Published to ${topic}: ${messageStr}`);
    return true;
};

// Subscribe to a specific topic
const subscribeToTopic = (topic) => {
    if (!client || !isConnected) {
        console.error('MQTT client not connected');
        return false;
    }

    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Failed to subscribe to ${topic}:`, err);
            return false;
        }
        console.log(`Subscribed to ${topic}`);
    });
    return true;
};

// Set callback for message handling
const setMessageCallback = (callback) => {
    messageCallback = callback;
};

// Get current train data
const getTrainData = () => {
    return trainData;
};

// Check connection status
const getConnectionStatus = () => {
    return isConnected;
};

// Disconnect from MQTT
const disconnect = () => {
    if (client) {
        client.end();
        isConnected = false;
        console.log('Disconnected from MQTT');
    }
};

module.exports = {
    connectMQTT,
    publishMessage,
    subscribeToTopic,
    setMessageCallback,
    getTrainData,
    getConnectionStatus,
    disconnect
};
