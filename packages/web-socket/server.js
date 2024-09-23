// server.js
const WebSocket = require('ws');

// Create a WebSocket server on port 8060
const wss = new WebSocket.Server({ port: 8060 });

wss.on('connection', (ws) => {
  // When a message is received from the client
  ws.on('message', (message) => {
    // Echo the message back to the client
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${message}`);
        }
    });
  });

  // // When the client disconnects
  // ws.on('close', () => {
  //   console.log('Client disconnected');
  // });
});

console.log('WebSocket server is running on ws://localhost:8060');