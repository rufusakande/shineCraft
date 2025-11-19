import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { upload, processUploadedFiles } from '../middlewares/upload.middleware';
import { FileUtils } from '../utils/file.utils';
import categoryController from '../controllers/category.controller';
import productController from '../controllers/product.controller';
import { adminProfileController, adminSettingsController } from '../controllers/admin.controller';
import Order from '../models/Order';
import User from '../models/User';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Profile routes
router.get('/profile', (req, res) => adminProfileController.getProfile(req, res));
router.put('/profile', (req, res) => adminProfileController.updateProfile(req, res));

// Settings routes
router.get('/settings', (req, res) => adminSettingsController.getSettings(req, res));
router.put('/settings', (req, res) => adminSettingsController.updateSettings(req, res));

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

router.get('/products/:id', (req, res) => productController.getById(req, res));

router.put(
  '/products/:id',
  upload.array('images', 8),
  (req, res) => productController.update(req, res)
);

router.delete('/products/:id', (req, res) => productController.delete(req, res));

router.get('/products', (req, res) => productController.list(req, res));

// Orders routes
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Users routes
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;