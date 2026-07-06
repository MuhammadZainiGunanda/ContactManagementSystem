import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { UserOperationOutcome, UserRegistrationRequest } from "../model/user-management";
import { ResponseError } from "../error/response-error";
import jwt from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";

export class UserController {

     static async registrationUser(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               const registrationConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitUserRegistration(request.body);
          
               response.status(200).json({ success: true, message: "Register successfully", data: registrationConfirmation });
          } catch (error) {
               next(error);
          }
     }
     
     static async loginUser(request: Request, response: Response, next: NextFunction): Promise<void> {
          try {
               const loginUserConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitUserLogin(request.body);

               const createToken = jwt.sign({ ...loginUserConfirmation }, 
                    process.env.TOKEN_SECRET_KEY!, { expiresIn: process.env.EXPIRES_IN! });
               
               response.cookie("login", createToken, { httpOnly: true, secure: true, sameSite: "strict" })
               .status(200).json({ success: true, message: "User logged in successfully", data: loginUserConfirmation });
          } catch (error) {
               next(error);
          }
     }
     
     static async getUser(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const getUserConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitGetUser(request.user!);
          
               response.status(200).json({ success: true, message: "User data retrieved successfully", data: getUserConfirmation });
          } catch (error) {
               next(error);
          }
     }
     
     static async updateUser(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void>  {
          try {
               const updateUserConfirmation: UserOperationOutcome | ResponseError = 
                    await UserService.submitUpdateUser(request.user!, request.body);
          
               response.status(200).json({ success: true, message: "User data updated successfully", data: updateUserConfirmation });
          } catch (error) {
               next(error);
          }
     }
     
     static async logoutUser(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               response.clearCookie("login").status(200).json({ success: true, message: "User logged out successfully", data: "OK" });
          } catch (error) {
               next(error);
          }
     }

}