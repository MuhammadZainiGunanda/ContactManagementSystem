import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { UserOperationOutcome } from "../model/user-management";
import { ResponseError } from "../error/response-error";
import jwt from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";

export class UserController {

     static async createUserRegistration(request : Request, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Manggil layanan untuk proses buat user baru, dan nunggu konfirmasi
               const registrationConfirmation : UserOperationOutcome | ResponseError = 
                    await UserService.submitUserRegistration(request.body);

               // Jika OK, respons 200 serta data dari hasil konfirmasi
               response.status(200).json({ data: registrationConfirmation });
          } catch (error) {
               next(error); // Lempar Error ke middleware selanjutnya
          }
     }

     static async loginUserCredentials(request : Request, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Manggil layanan untuk prsess user login, dan nunggu konfirmasi
               const loginUserConfirmation : UserOperationOutcome | ResponseError = 
                    await UserService.submitUserLogin(request.body);

               // Jika OK, buat token JWT dengan data konfirmasi login, dengan mengatur waktu kedaluwarsa
               const createToken = jwt.sign({ ...loginUserConfirmation }, 
                    process.env.TOKEN_SECRET_KEY!, { expiresIn: process.env.EXPIRES_IN! });
               
               // Atur cookie dengan token JWT untuk otentikasi sesi
               response.cookie("login", createToken, { httpOnly: true, secure: true, sameSite: "strict" })
               .status(200).json({ data: loginUserConfirmation });
          } catch (error) {
               next(error); // Lempar Error ke middleware selanjutnya
          }
     }

     static async getUser(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Manggil layanan untuk proses mendapatkan data user, dan nunggu konfirmasi
               const getUserConfirmation : UserOperationOutcome | ResponseError = 
                    await UserService.submitGetUser(request.user!);

               // Jika OK, respons 200, serta data dari hasil konfirmasi
               response.status(200).json({ data: getUserConfirmation });
          } catch (error) {
               next(error); // Lempar Error ke middleware selanjutnya
          }
     }

     static async updateUser(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void>  {
          try {
               // Manggil layanan untuk proses update record user, dan nunggu konfirmasi
               const updateUserConfirmation : UserOperationOutcome | ResponseError = 
                    await UserService.submitUpdateUser(request.user!, request.body);

               // Jika OK, respons 200, serta data dari hasil konfirmasi
               response.status(200).json({ data: updateUserConfirmation });
          } catch (error) {
               next(error); // Lempar Error ke middleware selanjutnya
          }
     }

     static async logoutUser(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Clear cookie, serta respons 200 sebagai tanda proses logout berhasil
               response.clearCookie("login").status(200).json({ data: "OK" });
          } catch (error) {
               next(error); // Lempar Error ke middleware selanjutnya
          }
     }

}