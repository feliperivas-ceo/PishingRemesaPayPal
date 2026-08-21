import { Router } from 'express';
import { body } from 'express-validator';
import {
  createRequestHandler,
  listMyRequestsHandler,
  getMyRequestHandler,
} from '../controllers/requestController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('La cantidad debe ser mayor a 0'),
    body('currency').notEmpty().withMessage('La moneda es requerida'),
    body('reason')
      .isIn([
        'alimentacion',
        'compra_bienes',
        'gastos_personales',
        'apoyo_familiar',
        'educacion',
        'salud',
        'otro',
      ])
      .withMessage('Motivo invalido'),
    body('senderRelation')
      .isIn(['familiar', 'pareja', 'amigo', 'empresa', 'cliente', 'otro', 'no_sabe'])
      .withMessage('Relacion con el remitente invalida'),
    body('beneficiary.fullName').trim().notEmpty().withMessage('El nombre del beneficiario es requerido'),
    body('beneficiary.email').isEmail().withMessage('Correo del beneficiario invalido'),
    body('beneficiary.country').notEmpty().withMessage('El pais del beneficiario es requerido'),
    body('beneficiary.city').notEmpty().withMessage('La ciudad del beneficiario es requerida'),
    body('receivingMethod')
      .isIn(['cuenta_bancaria', 'billetera_digital', 'efectivo', 'otro'])
      .withMessage('Metodo de recepcion invalido'),
  ],
  validate,
  createRequestHandler
);

router.get('/', listMyRequestsHandler);
router.get('/:id', getMyRequestHandler);

export default router;
