import {
  PaymentReason,
  Prisma,
  ReceivingMethod,
  RequestStatus,
  SenderRelation,
  TransferRequest as DbTransferRequest,
} from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../utils/AppError';
import { generateRequestNumber } from '../utils/generateRequestNumber';

interface CreateRequestInput {
  userId: string;
  amount: number;
  currency: string;
  reason: string;
  senderRelation: string;
  beneficiary: { fullName: string; email: string; country: string; city: string; phone?: string };
  receivingMethod: string;
}

type RequestWithRelations = DbTransferRequest & {
  user?: { fullName: string; email: string };
  internalNotes?: { id: string; note: string; authorId: string; createdAt: Date }[];
};

function serializeRequest(request: RequestWithRelations) {
  return {
    _id: request.id,
    requestNumber: request.requestNumber,
    user: request.user ?? request.userId,
    originCountry: request.originCountry,
    destinationCountry: request.destinationCountry,
    amount: Number(request.amount),
    currency: request.currency,
    reason: request.reason,
    senderRelation: request.senderRelation,
    beneficiary: {
      fullName: request.beneficiaryFullName,
      email: request.beneficiaryEmail,
      country: request.beneficiaryCountry,
      city: request.beneficiaryCity,
      ...(request.beneficiaryPhone ? { phone: request.beneficiaryPhone } : {}),
    },
    receivingMethod: request.receivingMethod,
    status: request.status,
    internalNotes: (request.internalNotes ?? []).map((note) => ({
      _id: note.id,
      note: note.note,
      author: note.authorId,
      createdAt: note.createdAt,
    })),
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

export async function createRequest(input: CreateRequestInput) {
  const requestNumber = generateRequestNumber();
  const request = await prisma.$transaction(async (tx) => {
    const created = await tx.transferRequest.create({
      data: {
        requestNumber,
        userId: input.userId,
        originCountry: 'Canada',
        destinationCountry: 'Colombia',
        amount: new Prisma.Decimal(input.amount),
        currency: input.currency,
        reason: input.reason as PaymentReason,
        senderRelation: input.senderRelation as SenderRelation,
        beneficiaryFullName: input.beneficiary.fullName,
        beneficiaryEmail: input.beneficiary.email.toLowerCase(),
        beneficiaryCountry: input.beneficiary.country,
        beneficiaryCity: input.beneficiary.city,
        beneficiaryPhone: input.beneficiary.phone,
        receivingMethod: input.receivingMethod as ReceivingMethod,
      },
    });
    await tx.statusHistory.create({
      data: { requestId: created.id, previousStatus: null, newStatus: 'pendiente', changedById: input.userId },
    });
    await tx.notification.create({
      data: {
        userId: input.userId,
        requestId: created.id,
        type: 'request_created',
        message: `Tu solicitud ${created.requestNumber} fue registrada correctamente.`,
      },
    });
    return created;
  });
  return serializeRequest(request);
}

export async function listRequestsForUser(userId: string) {
  const requests = await prisma.transferRequest.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return requests.map(serializeRequest);
}

export async function getRequestForUser(userId: string, requestId: string) {
  const request = await prisma.transferRequest.findFirst({ where: { id: requestId, userId } });
  if (!request) throw new AppError('Solicitud no encontrada', 404);
  return serializeRequest(request);
}

interface AdminListFilters { status?: RequestStatus; search?: string; page?: number; limit?: number; }

export async function listRequestsForAdmin(filters: AdminListFilters) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
  const where: Prisma.TransferRequestWhereInput = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search
      ? { OR: [{ requestNumber: { contains: filters.search, mode: 'insensitive' } }, { beneficiaryEmail: { contains: filters.search, mode: 'insensitive' } }] }
      : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.transferRequest.findMany({
      where,
      include: { user: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transferRequest.count({ where }),
  ]);
  return { items: items.map(serializeRequest), total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateRequestStatus(requestId: string, newStatus: RequestStatus, adminId: string) {
  const request = await prisma.$transaction(async (tx) => {
    const current = await tx.transferRequest.findUnique({ where: { id: requestId } });
    if (!current) throw new AppError('Solicitud no encontrada', 404);
    const updated = await tx.transferRequest.update({ where: { id: requestId }, data: { status: newStatus } });
    await tx.statusHistory.create({ data: { requestId, previousStatus: current.status, newStatus, changedById: adminId } });
    await tx.notification.create({
      data: {
        userId: current.userId,
        requestId,
        type: 'status_change',
        message: `El estado de tu solicitud ${current.requestNumber} cambio a "${newStatus}".`,
      },
    });
    return updated;
  });
  return serializeRequest(request);
}

export async function addInternalNote(requestId: string, note: string, adminId: string) {
  const request = await prisma.$transaction(async (tx) => {
    const current = await tx.transferRequest.findUnique({ where: { id: requestId } });
    if (!current) throw new AppError('Solicitud no encontrada', 404);
    await tx.internalNote.create({ data: { requestId, authorId: adminId, note } });
    return tx.transferRequest.findUniqueOrThrow({
      where: { id: requestId },
      include: { internalNotes: { orderBy: { createdAt: 'asc' } } },
    });
  });
  return serializeRequest(request);
}

export async function getRequestHistory(requestId: string) {
  const history = await prisma.statusHistory.findMany({ where: { requestId }, orderBy: { createdAt: 'asc' } });
  return history.map(({ requestId: request, changedById: changedBy, ...item }) => ({ ...item, request, changedBy }));
}
