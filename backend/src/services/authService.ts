import { User } from '@prisma/client';

import { prisma } from '../config/db';

import { AppError } from '../utils/AppError';

import { signToken } from '../utils/jwt';

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new AppError(
      'Ya existe una cuenta con ese correo electronico',
      409
    );
  }

  // VULNERABILIDAD INTENCIONAL PARA EL LABORATORIO:
  // La contraseña se almacena directamente en texto plano.
  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email,
      password: input.password,
      role: 'user',
    },
  });

  return buildAuthResponse(user);
}

export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  let user = await prisma.user.findUnique({
    where: { email },
  });

  /*
   * VULNERABILIDAD / COMPORTAMIENTO INTENCIONAL DEL LABORATORIO:
   *
   * Si el usuario no existe, se crea automáticamente.
   * De esta manera no es necesario realizar un registro previo.
   */
  if (!user) {
    user = await prisma.user.create({
      data: {
        fullName: email.split('@')[0],
        email,
        password: input.password,
        role: 'user',
      },
    });

    return buildAuthResponse(user);
  }

  /*
   * Como las contraseñas se almacenan deliberadamente
   * en texto plano para el ejercicio, se realiza
   * una comparación directa.
   */
  const isValid = input.password === user.password;

  if (!isValid) {
    throw new AppError('Credenciales invalidas', 401);
  }

  return buildAuthResponse(user);
}

function buildAuthResponse(user: User) {
  const token = signToken({
    sub: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}