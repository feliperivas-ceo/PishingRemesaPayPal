-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');
CREATE TYPE "RequestStatus" AS ENUM ('pendiente', 'en_revision', 'aprobada', 'rechazada', 'completada');
CREATE TYPE "PaymentReason" AS ENUM ('alimentacion', 'compra_bienes', 'gastos_personales', 'apoyo_familiar', 'educacion', 'salud', 'otro');
CREATE TYPE "SenderRelation" AS ENUM ('familiar', 'pareja', 'amigo', 'empresa', 'cliente', 'otro', 'no_sabe');
CREATE TYPE "ReceivingMethod" AS ENUM ('cuenta_bancaria', 'billetera_digital', 'efectivo', 'otro');
CREATE TYPE "NotificationType" AS ENUM ('status_change', 'request_created', 'system');

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

CREATE TABLE "TransferRequest" (
    "_id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL DEFAULT 'Canada',
    "destinationCountry" TEXT NOT NULL DEFAULT 'Colombia',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "reason" "PaymentReason" NOT NULL,
    "senderRelation" "SenderRelation" NOT NULL,
    "beneficiaryFullName" TEXT NOT NULL,
    "beneficiaryEmail" TEXT NOT NULL,
    "beneficiaryCountry" TEXT NOT NULL,
    "beneficiaryCity" TEXT NOT NULL,
    "beneficiaryPhone" TEXT,
    "receivingMethod" "ReceivingMethod" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TransferRequest_pkey" PRIMARY KEY ("_id")
);

CREATE TABLE "InternalNote" (
    "_id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("_id")
);

CREATE TABLE "StatusHistory" (
    "_id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "previousStatus" "RequestStatus",
    "newStatus" "RequestStatus" NOT NULL,
    "changedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("_id")
);

CREATE TABLE "Notification" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestId" TEXT,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "TransferRequest_requestNumber_key" ON "TransferRequest"("requestNumber");
CREATE INDEX "TransferRequest_userId_createdAt_idx" ON "TransferRequest"("userId", "createdAt");
CREATE INDEX "TransferRequest_status_createdAt_idx" ON "TransferRequest"("status", "createdAt");
CREATE INDEX "TransferRequest_beneficiaryEmail_idx" ON "TransferRequest"("beneficiaryEmail");
CREATE INDEX "InternalNote_requestId_createdAt_idx" ON "InternalNote"("requestId", "createdAt");
CREATE INDEX "StatusHistory_requestId_createdAt_idx" ON "StatusHistory"("requestId", "createdAt");
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");
CREATE INDEX "Notification_requestId_idx" ON "Notification"("requestId");

-- AddForeignKey
ALTER TABLE "TransferRequest" ADD CONSTRAINT "TransferRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "TransferRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "TransferRequest"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "TransferRequest"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
