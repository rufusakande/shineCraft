import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { upload, processUploadedFiles } from '../middlewares/upload.middleware';
import { FileUtils } from '../utils/file.utils';
import categoryController from '../controllers/category.controller';
import productController from '../controllers/product.controller';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Category routes
router.post('/categories', (req, res) => categoryController.create(req, res));
router.put('/categories/:id', (req, res) => categoryController.update(req, res));
router.delete('/categories/:id', (req, res) => categoryController.delete(req, res));
router.get('/categories', (req, res) => categoryController.list(req, res));

// Product routes
router.post(
  '/products',
  upload.array('images', 8),
  (req, res) => productController.create(req, res)
);

router.put(
  '/products/:id',
  upload.array('images', 8),
  (req, res) => productController.update(req, res)
);

router.delete('/products/:id', (req, res) => productController.delete(req, res));
router.get('/products', (req, res) => productController.list(req, res));

export default router;