const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { createClient } = require('redis');

// Create an Express application
const app = express();
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Create Redis clients
const redisPublisher = createClient();
const redisSubscriber = createClient();

// Add error handling and connection checks for Redis clients
redisPublisher.on('error', (err) => {
  console.error('Redis Publisher Error:', err);
});

redisSubscriber.on('error', (err) => {
  console.error('Redis Subscriber Error:', err);
});

redisPublisher.connect().then(() => {
  console.log('Redis Publisher connected');
}).catch(err => {
  console.error('Error connecting Redis Publisher:', err);
});

redisSubscriber.connect().then(() => {
  console.log('Redis Subscriber connected');

  // Subscribe to the Redis channel for broadcasting messages
  redisSubscriber.subscribe('messages', (message) => {
    console.log('Message received from Redis:', message);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  redisSubscriber.subscribe('typing', (message) => {
    console.log('Typing notification received from Redis:', message);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

}).catch(err => {
  console.error('Error connecting Redis Subscriber:', err);
});

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Handle incoming messages from WebSocket clients
  ws.on('message', (message) => {
    console.log('Message received from client:', message);
    let parsedMessage;

    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.error('Error parsing message:', error);
      return;
    }

    if (parsedMessage.type === 'message') {
      // Store message in Redis list
      const channel = parsedMessage.channel;
      const messageKey = `channel:${channel}:messages`;

      redisPublisher.rpush(messageKey, message, (err, res) => {
        if (err) {
          console.error('Error storing message:', err);
        } else {
          console.log('Message stored in Redis:', res);

          // Publish message to Redis channel for broadcasting
          redisPublisher.publish('messages', message, (err, res) => {
            if (err) {
              console.error('Error publishing message:', err);
            } else {
              console.log('Message published to Redis channel:', res);
            }
          });
        }
      });
    } else if (parsedMessage.type === 'typing') {
      // Publish typing notification to Redis channel for broadcasting
      redisPublisher.publish('typing', message, (err, res) => {
        if (err) {
          console.error('Error publishing typing notification:', err);
        } else {
          console.log('Typing notification published to Redis channel:', res);
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
