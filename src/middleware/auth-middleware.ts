import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";
import { prismaClient } from "../app/database";
import { User } from "@prisma/client";

export async function authMiddleware(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
     // Ambil token user dari cookie
     const userToken = request.cookies["login"];

     // Jika token user ada
     if (userToken) {
          try {
               // Dekode token JWT untuk mendapatkan payload
               const decodeToken: string | JwtPayload = jwt.verify(userToken, process.env.TOKEN_SECRET_KEY!);

               // Cari user berdasarkan username dalam token
               const findUser: User | null = await prismaClient.user.findUnique({
                    where: { username: decodeToken.username }
               });

               // Jika user tidak ditemukan dalam database, kembalikan respons error
               if (!findUser) {
                    response.status(400).json({ success: false, message: "Access denied", data: {} });
               }

               // Jika user ditemukan, tambahkan informasi user ke dalam objek request dan lanjutkan ke middleware berikutnya
               request.user = findUser!;
               next();
          } catch (error) {
               // Jika terjadi kesalahan dalam verifikasi token, kembalikan respons error
               response.status(400).json({ success: false, message: "Access denied", data: {} });
          }
     } else {
          // Jika tidak ada token user, lempar respons error
          response.status(400).json({ success: false, message: "Access denied", data: {} });
     }
}