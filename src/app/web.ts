import express, { Application } from 'express';
import { publicRouter } from '../router/public-api';
import { errorMiddleware } from '../middleware/error-middleware';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { privateRouter } from '../router/private-api';

dotenv.config();
export const webApplication: Application = express();

webApplication.use(express.json());
webApplication.use(cookieParser());
webApplication.use(publicRouter);
webApplication.use(privateRouter);
webApplication.use(errorMiddleware);