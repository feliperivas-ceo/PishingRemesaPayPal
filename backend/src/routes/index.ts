import { Router } from 'express';
import authRoutes from './authRoutes';
import requestRoutes from './requestRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/admin', adminRoutes);

export default router;
