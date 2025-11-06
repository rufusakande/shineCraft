import { Router } from 'express';
import categoryRoutes from './admin/categoryRoutes';

const router = Router();

// Admin routes
router.use('/api/admin/categories', categoryRoutes);

export default router;