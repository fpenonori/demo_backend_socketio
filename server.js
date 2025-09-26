const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
const chatSockets = require('./sockets/chatSockets');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(express.json());

app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

chatSockets(io);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced!');
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });