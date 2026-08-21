import express from 'express';
import cors from 'cors';

import { env } from './config/env';

import routes from './routes';

import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (_req, res) =>
  res.status(200).json({ status: 'ok' })
);

app.use('/api', routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;