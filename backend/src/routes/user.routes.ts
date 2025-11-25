import express from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, userController.updateProfile);

// Get user orders
router.get('/orders', authMiddleware, userController.getOrders);

// Get single order
router.get('/orders/:id', authMiddleware, userController.getOrder);

export default router;
