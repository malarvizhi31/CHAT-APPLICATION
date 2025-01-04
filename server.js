const WebSocket = require('ws');
const http = require('http');

// Create the HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is Running');
});

// Create the WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  // When a message is received from a client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message); // Send the message to all other clients
      }
    });

    // Send a response back to the sender
    const serverResponse = `Server Response: Received your message - "${message}"`;
    ws.send(serverResponse); // Send the response to the client that sent the message
  });

  // Handle client disconnecting
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server and listen on port 8080
server.listen(8080, () => {
  console.log('Server is listening on ws://localhost:8080');
});
