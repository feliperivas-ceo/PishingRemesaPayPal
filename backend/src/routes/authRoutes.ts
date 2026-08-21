import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, me } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Correo electronico invalido'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contrasena debe tener al menos 8 caracteres'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Correo electronico invalido'),
    body('password').notEmpty().withMessage('La contrasena es requerida'),
  ],
  validate,
  login
);

router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

export default router;
