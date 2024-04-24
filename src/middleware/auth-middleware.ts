import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";
import { prismaClient } from "../app/database";

export async function authMiddleware(request: RequestUserValidator, response: Response, next: NextFunction) : Promise<void> {
     const userToken = request.cookies["login"];

     if (userToken) {
          const decodeToken = jwt.verify(userToken, process.env.TOKEN_SECRET_KEY!);

          const findUser = await prismaClient.user.findUnique({
               where: { username: decodeToken.username }
          });

          if (!findUser) {
               response.status(400).json({ errors: "Unauthorized"});
          }

          request.user = findUser!;
          next();
     } else {
          response.status(400).json({ errors: "Unauthorized"});
     }
}