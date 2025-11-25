import { Response } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth.middleware';

class UserController {
  // Get user profile
  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findByPk(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user orders for stats
    const orders = await Order.findAll({
      where: { userId: req.user?.id },
      attributes: ['total'],
    });

    const totalSpent = orders.reduce((sum, order: any) => sum + (Number(order.total) || 0), 0);

    res.json({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      totalOrders: orders.length,
      totalSpent: totalSpent,
      memberSince: user.createdAt,
    });
  });

  // Update user profile
  updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, firstName, lastName, phone } = req.body;
    
    const user = await User.findByPk(req.user?.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data (don't update email)
    if (name !== undefined) user.name = name;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    // Get updated orders for stats
    const orders = await Order.findAll({
      where: { userId: req.user?.id },
      attributes: ['total'],
    });

    const totalSpent = orders.reduce((sum, order: any) => sum + (Number(order.total) || 0), 0);

    res.json({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      totalOrders: orders.length,
      totalSpent: totalSpent,
      memberSince: user.createdAt,
      message: 'Profile updated successfully',
    });
  });

  // Get user orders
  getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await Order.findAll({
      where: { userId: req.user?.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      orders: orders || [],
      total: orders?.length || 0,
    });
  });

  // Get single order
  getOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.user?.id 
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  });
}

export default new UserController();
