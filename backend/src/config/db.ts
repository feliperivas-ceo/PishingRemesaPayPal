import { PrismaClient } from '@prisma/client';
import { env } from './env';

const globalForPrisma = global as typeof globalThis & { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (env.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('[db] Conectado a PostgreSQL');
  } catch (error) {
    console.error('[db] Error al conectar a PostgreSQL:', error);
    process.exit(1);
  }
}
