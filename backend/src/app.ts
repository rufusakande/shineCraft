import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { FileUtils } from './utils/file.utils';
import { sequelize, testConnection } from './config/database';
import { seedAdmin } from './seed/adminSeed';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Initialize socket service
import { initializeSocket } from './sockets/socket.service';
initializeSocket(io);

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, express.static(path.join(process.cwd(), FileUtils.UPLOAD_DIR)));

// Routes
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';
import paymentRoutes from './routes/payments';
import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', publicRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Initialisation de la base de données et du seed
async function initializeDatabase() {
  try {
    // Test de la connexion
    await testConnection();
    
    // Synchronisation des modèles avec la base de données
    await sequelize.sync();
    console.log('📦 All models were synchronized successfully.');
    
    // Création de l'admin si nécessaire
    await seedAdmin();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Appeler l'initialisation au démarrage
initializeDatabase();

export { app, httpServer, io };