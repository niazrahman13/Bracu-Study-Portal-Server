// app.js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io'; // For real-time chat features
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();
const server = http.createServer(app);

// Set up Socket.io for real-time chat
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'], // Adjust with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for chat messages
  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data); // Broadcast the message to all connected clients
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

// Application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hi Next Level Devs !');
});

app.use(globalErrorHandler);

// Not Found middleware
app.use(notFound);

export { app }; // Only exporting app
