import { NextFunction, Response } from "express";
import { ContactService } from "../service/contact-service";
import { RequestUserValidator } from "../types/request-middleware";
import { ContactOperationOutcome, InputContactUpdateRequest } from "../model/contact-management";
import { ResponseError } from "../error/response-error";

export class ContactController {

     static async createContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               const submitCreateContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitCreateContact(request.user!, request.body);

               response.status(200).json({ data: submitCreateContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async getContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               const submitGetContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitGetContact(request.user!, Number(request.params.contactId));

               response.status(200).json({ data: submitGetContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async updateContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               const requestPayload : InputContactUpdateRequest = request.body as InputContactUpdateRequest;
               requestPayload.id = Number(request.params.contactId);

               const submitUpdateContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitUpdateContact(request.user!, requestPayload);

               response.status(200).json({ data: submitUpdateContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async removeContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               const submitRemoveContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitRemoveContact(request.user!, Number(request.params.contactId));

               response.status(200).json({ data: "Successfully" });
          } catch (error) {
               next(error);
          }
     }

}