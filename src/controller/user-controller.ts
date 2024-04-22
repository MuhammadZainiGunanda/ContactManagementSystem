import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { InputUserRegistration, UserOperationOutcome } from "../model/user-management";
import { ResponseError } from "../error/response-error";

export class UserController {

     static async createUserRegistration(request : Request, response : Response, next : NextFunction) : Promise<void> {
          try {
               const registrationConfirmation : UserOperationOutcome | ResponseError = 
                    await UserService.submitUserRegistration(request.body as InputUserRegistration);

               response.status(200).json({ data: registrationConfirmation });
          } catch (error) {
               next(error);
          }
     }

}