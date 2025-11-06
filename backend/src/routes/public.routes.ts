import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import categoryController from '../controllers/category.controller';
import publicProductController from '../controllers/public.product.controller';
import orderController from '../controllers/order.controller';

const router = express.Router();

// Public product routes
router.get('/products', (req, res) => publicProductController.list(req, res));
router.get('/products/:slug', (req, res) => publicProductController.getBySlug(req, res));

// Public category routes
router.get('/categories', (req, res) => categoryController.list(req, res));

// Cart/Order routes
router.post('/cart/checkout', (req, res) => orderController.checkout(req, res));
router.get('/orders/:id', authMiddleware, (req, res) => orderController.getOrder(req, res));

export default router;