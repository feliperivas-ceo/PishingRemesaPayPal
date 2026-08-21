import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  listRequestsForAdmin,
  updateRequestStatus,
  addInternalNote,
  getRequestHistory,
} from '../services/requestService';
import { RequestStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';

export async function listRequestsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, search, page, limit } = req.query;
    const result = await listRequestsForAdmin({
      status: status as RequestStatus | undefined,
      search: search as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateStatusHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw new AppError('No autenticado', 401);
    const { status } = req.body;
    const request = await updateRequestStatus(req.params.id, status, req.auth.sub);
    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
}

export async function addNoteHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw new AppError('No autenticado', 401);
    const { note } = req.body;
    const request = await addInternalNote(req.params.id, note, req.auth.sub);
    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
}

export async function getHistoryHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const history = await getRequestHistory(req.params.id);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
}
