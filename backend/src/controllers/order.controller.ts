import { Request, Response } from 'express';
import { Product, Order, Notification, User } from '../models';
import { ApiError, formatResponse, formatError } from '../utils/api.utils';
import { sequelize } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getSocketService } from '../sockets/socket.service';

interface CartItem {
  productId: number;
  quantity: number;
}

interface CheckoutData {
  items: CartItem[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email?: string;
  name?: string;
}

class OrderController {
  async checkout(req: AuthRequest, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const { items, address, email, name }: CheckoutData = req.body;

      if (!items?.length) {
        throw new ApiError(400, 'Cart is empty');
      }

      // Validate items and calculate total
      let total = 0;
      const orderItems = [];
      const stockUpdates = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          throw new ApiError(404, `Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new ApiError(400, `Insufficient stock for ${product.title}`);
        }

        // Prepare stock update
        stockUpdates.push(
          Product.update(
            { stock: product.stock - item.quantity },
            { where: { id: product.id }, transaction }
          )
        );

        // Calculate item total and prepare order item
        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;
        orderItems.push({
          productId: product.id,
          qty: item.quantity,
          price: product.price
        });
      }

      // Create order
      const order = await Order.create({
        userId: req.user?.id, // Optional: linked to user if authenticated
        items: orderItems,
        total,
        status: 'pending',
        address,
        email: req.user?.email || email,
        name: req.user?.name || name
      }, { transaction });

      // Update stock for all products
      await Promise.all(stockUpdates);

      // Create notification
      const notification = await Notification.create({
        type: 'NEW_ORDER',
        message: `New order #${order.id} received`,
        read: false,
        meta: { orderId: order.id, total },
        userId: req.user?.id
      }, { transaction });

      await transaction.commit();

      // Emit notifications for new order
      const socketService = getSocketService();
      socketService.notifyNewOrder({
        type: 'NEW_ORDER',
        orderId: order.id,
        total: Number(order.total),
        items: orderItems.length,
        customerName: req.user?.name || 'Guest',
        timestamp: new Date().toISOString()
      });

      // Check and notify for low stock
      for (const item of orderItems) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          await socketService.checkAndNotifyStock(
            product.id,
            product.title,
            product.stock - item.qty
          );
        }
      }

      return res.status(201).json(formatResponse({
        orderId: order.id,
        status: order.status,
        total
      }));

    } catch (error) {
      await transaction.rollback();
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to process order'));
    }
  }

  async getOrder(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      // Build query based on user role
      const query = req.user?.role === 'admin' 
        ? { id }
        : { id, userId: req.user?.id };

      const order = await Order.findOne({
        where: query,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      return res.json(formatResponse(order));
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to fetch order'));
    }
  }
}

export default new OrderController();