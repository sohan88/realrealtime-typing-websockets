# WebSocket Chat Application with Typing Notifications

This is a simple chat application built using WebSocket and Redis for real-time messaging and typing notifications. The backend is implemented using Node.js, Express, WebSocket, and Redis.

## Features

- Real-time messaging between clients.
- Typing notifications to indicate when a user is typing.
- Messages are stored in Redis and broadcasted to all connected clients.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [Redis](https://redis.io/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/sohan88/websocket-chat-app.git
    cd websocket-chat-app
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the Redis server (if not already running):

    ```bash
    redis-server
    ```

## Running the Application

To start the server, run:

```bash
node server.js
```

The server will start on port 8080. You can access the chat application by opening your browser and navigating to http://localhost:8080.

## Server Code Overview
- server.js: The main server file that sets up the Express application, WebSocket server, and Redis clients.

## How it works? 
1. Express Application: Sets up an Express server.
2. WebSocket Server: Listens for WebSocket connections and handles incoming messages.
3. Redis Clients: Two Redis clients are created:
4. redisPublisher: Used to publish messages to Redis channels.
5. redisSubscriber: Used to subscribe to Redis channels and broadcast messages to all connected WebSocket clients.
6. WebSocket Connection: Handles WebSocket connections, incoming messages, and disconnections.
7. Redis Subscription: Subscribes to the messages and typing channels to broadcast messages and typing notifications to all connected clients.

## Contributing
If you would like to contribute to this project, please feel free to submit a pull request or open an issue.

## License
This project is licensed under the MIT License.

## Acknowledgements
- [Node.js](https://nodejs.org/) (v14.x or later)
- [Redis](https://redis.io/)
- [Express](https://expressjs.com/)
- [WebSocket](https://www.npmjs.com/package/ws)
