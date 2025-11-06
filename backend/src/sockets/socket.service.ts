import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    role: string;
  };
}

// Notification types
export interface OrderNotification {
  type: 'NEW_ORDER';
  orderId: number;
  total: number;
  items: number;
  customerName: string;
  timestamp: string;
}

export interface LowStockNotification {
  type: 'LOW_STOCK';
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  timestamp: string;
}

export type NotificationPayload = OrderNotification | LowStockNotification;

export class SocketService {
  private io: Server;
  private readonly STOCK_THRESHOLD = Number(process.env.STOCK_THRESHOLD) || 5;

  constructor(io: Server) {
    this.io = io;
    this.setupSocketAuth();
  }

  private setupSocketAuth() {
    // Middleware d'authentification Socket.IO
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication error');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
        const user = await User.findByPk(decoded.id);

        if (!user) {
          throw new Error('User not found');
        }

        // Attacher l'utilisateur au socket
        socket.user = {
          id: user.id,
          role: user.role
        };

        // Rejoindre la room appropriée basée sur le rôle
        if (user.role === 'admin') {
          socket.join('admin');
        }
        socket.join(`user:${user.id}`);

        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    // Gestionnaire de connexion
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.user?.id}`);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user?.id}`);
      });
    });
  }

  // Envoyer une notification de nouvelle commande aux admins
  public notifyNewOrder(orderData: OrderNotification) {
    this.io.to('admin').emit('notification', {
      ...orderData,
      timestamp: new Date().toISOString()
    });
  }

  // Envoyer une notification de stock bas aux admins
  public notifyLowStock(stockData: LowStockNotification) {
    this.io.to('admin').emit('notification', {
      ...stockData,
      timestamp: new Date().toISOString()
    });
  }

  // Envoyer une notification à un utilisateur spécifique
  public notifyUser(userId: number, payload: NotificationPayload) {
    this.io.to(`user:${userId}`).emit('notification', {
      ...payload,
      timestamp: new Date().toISOString()
    });
  }

  // Vérifier le stock et émettre une notification si nécessaire
  public async checkAndNotifyStock(productId: number, productName: string, currentStock: number) {
    if (currentStock <= this.STOCK_THRESHOLD) {
      this.notifyLowStock({
        type: 'LOW_STOCK',
        productId,
        productName,
        currentStock,
        threshold: this.STOCK_THRESHOLD,
        timestamp: new Date().toISOString()
      });
    }
  }
}

let socketService: SocketService;

export const initializeSocket = (io: Server) => {
  socketService = new SocketService(io);
  return socketService;
};

export const getSocketService = () => {
  if (!socketService) {
    throw new Error('Socket service not initialized');
  }
  return socketService;
};