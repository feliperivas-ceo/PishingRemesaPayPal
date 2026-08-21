import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/db';
import { AppError } from '../utils/AppError';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, password } = req.body;
    const result = await registerUser({ fullName, email, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// El logout con JWT stateless se maneja en el cliente (borrar el token).
// Este endpoint existe por consistencia de API y para futura extension
// (ej. lista negra de tokens) si el proyecto lo requiere.
export async function logout(_req: Request, res: Response) {
  res.status(200).json({ message: 'Sesion cerrada' });
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.auth) {
      throw new AppError('No autenticado', 401);
    }
    const user = await prisma.user.findUnique({ where: { id: req.auth.sub } });
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}
