import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Checkout endpoint - can be used by authenticated or guest users
router.post('/checkout', orderController.checkout.bind(orderController));

// Get specific order - requires authentication
router.get('/:id', authMiddleware, orderController.getOrder.bind(orderController));

// Download invoice - requires authentication
router.get('/:id/invoice', authMiddleware, orderController.downloadInvoice.bind(orderController));

export default router;
