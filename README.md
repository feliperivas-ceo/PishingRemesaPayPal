# Remesas App — desarrollo local

Aplicación educativa para registrar y administrar solicitudes de recepción de dinero desde Canadá hacia Colombia. No mueve dinero real ni se integra con proveedores de pago.

## Stack

- Backend: Node.js, TypeScript, Express, PostgreSQL, Prisma, JWT, bcrypt y express-validator.
- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router y Axios.

## Requisitos

- Node.js 20 o superior.
- PostgreSQL local en `localhost:5432`.

## Configuración local

1. Crea una base de datos vacía llamada `remesas`.

2. Copia los archivos de ejemplo:

   ```bash
   cd backend
   cp .env.example .env
   cd ../frontend
   cp .env.example .env
   ```

3. En `backend/.env`, configura una URL local válida. No subas este archivo ni sus secretos:

   ```env
   DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:5432/remesas?schema=public"
   JWT_SECRET=un-secreto-largo-y-aleatorio
   ```

4. Instala las dependencias y aplica la migración:

   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev
   ```

5. Inicia ambos servicios en terminales separadas:

   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

El frontend queda disponible en `http://localhost:5173` y la API en `http://localhost:4000`.

## Verificación

- Crea una cuenta e inicia sesión.
- Crea una solicitud y confirma que aparece en Historial.
- Para habilitar un administrador local, cambia el campo `role` del usuario a `admin` mediante Prisma Studio:

  ```bash
  cd backend
  npm run prisma:studio
  ```

Las contraseñas se guardan únicamente como hashes bcrypt. El token JWT se usa para autenticar las solicitudes al backend.
