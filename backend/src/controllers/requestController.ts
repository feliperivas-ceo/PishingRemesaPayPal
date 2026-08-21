import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  createRequest,
  listRequestsForUser,
  getRequestForUser,
} from '../services/requestService';
import { AppError } from '../utils/AppError';

export async function createRequestHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw new AppError('No autenticado', 401);

    const { amount, currency, reason, senderRelation, beneficiary, receivingMethod } = req.body;

    const request = await createRequest({
      userId: req.auth.sub,
      amount,
      currency,
      reason,
      senderRelation,
      beneficiary,
      receivingMethod,
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

export async function listMyRequestsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw new AppError('No autenticado', 401);
    const requests = await listRequestsForUser(req.auth.sub);
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
}

export async function getMyRequestHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw new AppError('No autenticado', 401);
    const request = await getRequestForUser(req.auth.sub, req.params.id);
    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
}
