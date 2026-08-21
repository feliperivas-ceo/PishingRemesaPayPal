import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from '../utils/AppError';

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.auth || req.auth.role !== 'admin') {
    return next(new AppError('Se requieren permisos de administrador', 403));
  }
  next();
}
