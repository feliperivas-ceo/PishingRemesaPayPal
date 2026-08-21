import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  auth?: JwtPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('No se proporciono un token de autenticacion', 401));
  }

  const token = header.split(' ')[1];

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(new AppError('Token invalido o expirado', 401));
  }
}
