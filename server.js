const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database'); // Sequelize instance
const chatSockets = require('./sockets/chatSockets'); // Import socket logic
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3002',  // Update to match your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Chat routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Set up Socket.IO
chatSockets(io);

// Sync the database
sequelize.sync({ alter: true })  // Sync the Sequelize models with the database
  .then(() => {
    console.log('Database synced!');
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
