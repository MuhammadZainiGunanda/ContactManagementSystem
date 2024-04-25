import { NextFunction, Response } from "express";
import { ContactService } from "../service/contact-service";
import { RequestUserValidator } from "../types/request-middleware";

export class ContactController {

     static async createContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               const submitCreateContactConfirmation = await ContactService.submitCreateContact(request.user!, request.body);

               response.status(200).json({ data: submitCreateContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async getContact(request : RequestUserValidator, response : Response, next: NextFunction) : Promise<void> {
          try {
               const submitGetContactConfirmation = await ContactService.submitGetContact(request.user!, Number(request.params.contactId));

               response.status(200).json({ data: submitGetContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

}