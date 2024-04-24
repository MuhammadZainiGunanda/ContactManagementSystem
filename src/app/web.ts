import express, { Application } from 'express';
import { publicRouter } from '../router/public-api';
import { errorMiddleware } from '../middleware/error-middleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { privateRouter } from '../router/private-api';

dotenv.config();
export const web : Application = express();

web.use(express.json());
web.use(cookieParser());
web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware);