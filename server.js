// server.js

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const orderController = require('./controller/shippingdetail');

// ... Rest of your server configuration ...

// Initialize Socket.IO
orderController.initializeSocket(io);

// ... Other routes and server logic ...

// Start the server
http.listen(3000, () => {
  console.log('Server started on port 3000');
});
