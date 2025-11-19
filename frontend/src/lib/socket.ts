import { io, Socket } from 'socket.io-client';
import { toast } from '../hooks/use-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface NotificationPayload {
  type: 'NEW_ORDER' | 'LOW_STOCK';
  timestamp: string;
  [key: string]: any;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (!this.reconnectTimer) {
        this.reconnectTimer = setInterval(() => this.connect(), 5000);
      }
    });

    this.socket.on('notification', (payload: NotificationPayload) => {
      this.handleNotification(payload);
    });
  }

  private handleNotification(payload: NotificationPayload) {
    switch (payload.type) {
      case 'NEW_ORDER':
        toast({
          title: 'New Order',
          description: `Order #${payload.orderId} received from ${payload.customerName}`,
          variant: 'default',
        });
        break;

      case 'LOW_STOCK':
        toast({
          title: 'Low Stock Alert',
          description: `${payload.productName} is running low (${payload.currentStock} remaining)`,
          variant: 'default',
        });
        break;

      default:
        console.log('Unknown notification type:', payload);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;