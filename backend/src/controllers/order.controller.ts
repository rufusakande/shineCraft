import { Request, Response } from 'express';
import { Product, Order, Notification, User } from '../models';
import { ApiError, formatResponse, formatError } from '../utils/api.utils';
import { sequelize } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getSocketService } from '../sockets/socket.service';
import emailService from '../services/email.service';
import invoiceService from '../services/invoice.service';

interface CartItem {
  productId: number;
  quantity: number;
}

interface CheckoutData {
  items: CartItem[];
  address: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    postalCode?: string;
    country: string;
  };
  email?: string;
  name?: string;
}

// Helper function to normalize address
function normalizeAddress(address: any) {
  return {
    street: address.street || '',
    city: address.city || '',
    postalCode: address.zipCode || address.postalCode || '',
    country: address.country || '',
  };
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
        userId: req.user?.id || null,
        items: orderItems,
        total,
        status: 'pending',
        address,
        customerEmail: req.user?.email || email,
        customerName: req.user?.name || name
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

      // Send order confirmation email with invoice (fire and forget - non-blocking)
      const userEmail = req.user?.email || email;
      const userName = req.user?.name || name || 'Client';
      
      console.log(`📧 Order ${order.id} - Processing confirmation email for: ${userEmail}`);
      
      if (userEmail) {
        // Send email in background (don't await)
        (async () => {
          try {
            console.log(`🔄 Generating invoice for order ${order.id}...`);
            
            // Prepare invoice data
            const normalizedAddress = normalizeAddress(address);
            const invoiceData = {
              orderNumber: `SHC-${(order.id || 0).toString().padStart(6, '0')}`,
              orderDate: order.createdAt || new Date(),
              customerName: userName,
              customerEmail: userEmail,
              customerPhone: undefined,
              shippingAddress: normalizedAddress,
              items: orderItems.map((item: any) => ({
                productName: `Product #${item.productId}`,
                quantity: item.qty,
                price: Number(item.price),
                total: Number(item.price) * item.qty,
              })),
              subtotal: total,
              shippingCost: 0,
              tax: 0,
              total: total,
              paymentStatus: 'pending' as const,
            };

            console.log(`📄 Invoice data prepared for order ${order.id}`);

            // Send email with invoice
            console.log(`📧 Sending order confirmation email to ${userEmail}...`);
            await emailService.sendOrderConfirmationEmail(
              userEmail,
              userName,
              order
            );
            console.log(`✅ Order confirmation email sent successfully for order ${order.id}`);
          } catch (emailError) {
            console.error(`❌ Failed to send order confirmation email for order ${order.id}:`, emailError);
            // Don't fail the order if email fails
          }
        })();
      } else {
        console.warn(`⚠️ No email address found for order ${order.id}`);
      }

      // Emit notifications for new order
      const socketService = getSocketService();
      socketService.notifyNewOrder({
        type: 'NEW_ORDER',
        orderId: order.id || 0,
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
            product.id || 0,
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

  async downloadInvoice(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Get order - ensure user owns it or is admin
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

      // Prepare invoice data
      const items = Array.isArray(order.items) ? order.items : [];
      const subtotal = Number(order.total) || 0;
      const normalizedAddr = order.address ? normalizeAddress(order.address) : {
        street: '',
        city: '',
        postalCode: '',
        country: '',
      };

      const invoiceData = {
        orderNumber: `SHC-${(order.id || 0).toString().padStart(6, '0')}`,
        orderDate: order.createdAt || new Date(),
        customerName: order.customerName || (order as any).user?.name || 'Client',
        customerEmail: order.customerEmail || (order as any).user?.email || '',
        customerPhone: order.customerPhone,
        shippingAddress: normalizedAddr,
        items: items.map((item: any) => ({
          productName: `Product #${item.productId}`,
          quantity: item.qty || 1,
          price: Number(item.price) || 0,
          total: (Number(item.price) || 0) * (item.qty || 1),
        })),
        subtotal,
        shippingCost: 0,
        tax: 0,
        total: subtotal,
        paymentStatus: 'pending' as const,
      };

      // Generate PDF
      const pdfBuffer = await invoiceService.generateInvoice(invoiceData);

      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="facture-${invoiceData.orderNumber}.pdf"`
      );
      res.setHeader('Content-Length', pdfBuffer.length);

      return res.send(pdfBuffer);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(formatError(error.message));
      }
      return res.status(500).json(formatError('Failed to generate invoice'));
    }
  }
}

export default new OrderController();