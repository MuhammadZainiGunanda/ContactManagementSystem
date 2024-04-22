import express, { Application } from 'express';
import { publicRouter } from '../router/public-api';
import { errorMiddleware } from '../middleware/error-middleware';

export const web : Application = express();

web.use(express.json());
web.use(publicRouter);
web.use(errorMiddleware);