import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { UserOperationOutcome, UserRegistrationRequest } from "../model/user-management";
import { ResponseError } from "../error/response-error";
import jwt from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";

export class UserController {

     static async registrationUser(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses pembuatan user baru, dan tunggu konfirmasi
               const registrationConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitUserRegistration(request.body);
     
               // Jika berhasil, kirim respons 200 bersama dengan data konfirmasi
               response.status(200).json({ success: true, message: "Register successfully", data: registrationConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }
     
     static async loginUser(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk proses login user, dan tunggu konfirmasi
               const loginUserConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitUserLogin(request.body);
     
               // Jika berhasil, buat token JWT dengan data konfirmasi login, dan atur waktu kedaluwarsa
               const createToken = jwt.sign({ ...loginUserConfirmation }, 
                    process.env.TOKEN_SECRET_KEY!, { expiresIn: process.env.EXPIRES_IN! });
               
               // Atur cookie dengan token JWT untuk otentikasi sesi
               response.cookie("login", createToken, { httpOnly: true, secure: true, sameSite: "strict" })
               .status(200).json({ success: true, message: "User logged in successfully", data: loginUserConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }
     
     static async getUser(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk mendapatkan data user, dan tunggu konfirmasi
               const getUserConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitGetUser(request.user!);
     
               // Jika berhasil, kirim respons 200 bersama dengan data konfirmasi
               response.status(200).json({ success: true, message: "User data retrieved successfully", data: getUserConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }
     
     static async updateUser(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void>  {
          try {
               // Panggil layanan untuk proses pembaruan data user, dan tunggu konfirmasi
               const updateUserConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitUpdateUser(request.user!, request.body);
     
               // Jika berhasil, kirim respons 200 bersama dengan data konfirmasi
               response.status(200).json({ success: true, message: "User data updated successfully", data: updateUserConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }
     
     static async logoutUser(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Hapus cookie, dan kirim respons 200 sebagai tanda proses logout berhasil
               response.clearCookie("login").status(200).json({ success: true, message: "User logged out successfully", data: "OK" });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

}