import { Router } from 'express';
import { body } from 'express-validator';
import {
  listRequestsHandler,
  updateStatusHandler,
  addNoteHandler,
  getHistoryHandler,
} from '../controllers/adminController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminOnly';
import { validate } from '../middleware/validate';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/requests', listRequestsHandler);

router.patch(
  '/requests/:id/status',
  [
    body('status')
      .isIn(['pendiente', 'en_revision', 'aprobada', 'rechazada', 'completada'])
      .withMessage('Estado invalido'),
  ],
  validate,
  updateStatusHandler
);

router.post(
  '/requests/:id/notes',
  [body('note').trim().notEmpty().withMessage('La observacion no puede estar vacia')],
  validate,
  addNoteHandler
);

router.get('/requests/:id/history', getHistoryHandler);

export default router;
