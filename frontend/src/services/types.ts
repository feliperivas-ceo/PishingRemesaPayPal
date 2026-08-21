export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export type RequestStatus =
  | 'pendiente'
  | 'en_revision'
  | 'aprobada'
  | 'rechazada'
  | 'completada';

export interface Beneficiary {
  fullName: string;
  email: string;
  country: string;
  city: string;
  phone?: string;
}

export interface TransferRequest {
  _id: string;
  requestNumber: string;
  originCountry: string;
  destinationCountry: string;
  amount: number;
  currency: string;
  reason: string;
  senderRelation: string;
  beneficiary: Beneficiary;
  receivingMethod: string;
  status: RequestStatus;
  createdAt: string;
}

export const REASON_LABELS: Record<string, string> = {
  alimentacion: 'Alimentacion',
  compra_bienes: 'Compra de bienes',
  gastos_personales: 'Gastos personales',
  apoyo_familiar: 'Apoyo familiar',
  educacion: 'Educacion',
  salud: 'Salud',
  otro: 'Otro',
};

export const RELATION_LABELS: Record<string, string> = {
  familiar: 'Familiar',
  pareja: 'Pareja',
  amigo: 'Amigo',
  empresa: 'Empresa',
  cliente: 'Cliente',
  otro: 'Otro',
  no_sabe: 'No sabe',
};

export const METHOD_LABELS: Record<string, string> = {
  cuenta_bancaria: 'Cuenta bancaria',
  billetera_digital: 'Billetera digital',
  efectivo: 'Efectivo',
  otro: 'Otro',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pendiente: 'Pendiente',
  en_revision: 'En revision',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  completada: 'Completada',
};
