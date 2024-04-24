import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { UserOperationOutcome } from "../model/user-management";
import { ResponseError } from "../error/response-error";
import jwt from 'jsonwebtoken';
import { RequestUserValidator } from "../types/request-middleware";

export class UserController {

     static async createUserRegistration(request : Request, response : Response, next : NextFunction) : Promise<void> {
          try {
               const registrationConfirmation : UserOperationOutcome | ResponseError = 
                    await UserService.submitUserRegistration(request.body);

               response.status(200).json({ data: registrationConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async loginUserCredentials(request : Request, response : Response, next : NextFunction) : Promise<void> {
          try {
               const loginUserConfirmation : UserOperationOutcome | ResponseError = 
                    await UserService.submitUserLogin(request.body);

               const createToken = jwt.sign({ ...loginUserConfirmation }, process.env.TOKEN_SECRET_KEY!, { expiresIn: process.env.EXPIRES_IN! });

               response.cookie("login", createToken, { httpOnly: true, secure: true, sameSite: "strict" })
               .status(200).json({ data: loginUserConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async getUser(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               const getUserConfirmation : UserOperationOutcome = await UserService.submitGetUser(request.user!);

               response.status(200).json({ data: getUserConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async updateUser(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void>  {
          try {
               const updateUserConfirmation = await UserService.submitUpdateUser(request.user!, request.body);

               console.info(updateUserConfirmation);
               
               response.status(200).json({ data: updateUserConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async logoutUser(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               response.clearCookie("login").status(200).json({ data: "OK" });
          } catch (error) {
               next(error);
          }
     }

}