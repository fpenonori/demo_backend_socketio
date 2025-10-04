const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sequelize = require('./config/database');
const chatSockets = require('./sockets/chatSockets');
const { authenticateSocket } = require('./sockets/socketAuth');
const { requireAuthenticatedUser } = require('./middleware/requireChatToken');

const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use(authenticateSocket);

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/api/chat', requireAuthenticatedUser, chatRoutes);

chatSockets(io);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database synced!');
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

