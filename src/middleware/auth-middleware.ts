import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";
import { prismaClient } from "../app/database";
import { User } from "@prisma/client";

export async function authMiddleware(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
     const userToken = request.cookies["login"];

     if (userToken) {
          try {
               const decodeToken: string | JwtPayload = jwt.verify(userToken, process.env.TOKEN_SECRET_KEY!);

               const findUser: User | null = await prismaClient.user.findUnique({
                    where: { username: decodeToken.username }
               });

               if (!findUser) {
                    response.status(400).json({ success: false, message: "Access denied", data: {} });
               }

               request.user = findUser!;
               next();
          } catch (error) {
               response.status(400).json({ success: false, message: "Access denied", data: {} });
          }
     } else {
          response.status(400).json({ success: false, message: "Access denied", data: {} });
     }
}