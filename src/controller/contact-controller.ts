import { ContactSearchRequest, Paginated } from './../model/contact-management';
import { NextFunction, Response } from "express";
import { ContactService } from "../service/contact-service";
import { RequestUserValidator } from "../types/request-middleware";
import { ContactOperationOutcome, ContactUpdateRequest } from "../model/contact-management";
import { ResponseError } from "../error/response-error";

export class ContactController {

     static async createContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const submitCreateContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitCreateContact(request.user!, request.body);
               response.status(200).json({ success: true, message: "Contact created successfully", data: submitCreateContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async getContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const submitGetContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitGetContact(request.user!, Number(request.params.contactId));
               response.status(200).json({ success: true, message: "Contact retrieved successfully", data: submitGetContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async updateContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const requestPayload: ContactUpdateRequest = {
                    id: Number(request.params.contactId),
                    ...request.body
               };

               const submitUpdateContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitUpdateContact(request.user!, requestPayload);

               response.status(200).json({ success: true, message: "Contact updated successfully", data: submitUpdateContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

     static async removeContact(request: RequestUserValidator, response: Response, next: NextFunction) : Promise<void> {
          try {
               const submitRemoveContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitRemoveContact(request.user!, Number(request.params.contactId));

               response.status(200).json({ success: true, message: "Contact removed successfully", data: {} });
          } catch (error) {
               next(error);
          }
     }

     static async searchContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const searchContactRequest : ContactSearchRequest = {
                    name: request.query.name as string,
                    phone: request.query.phone as string,
                    email: request.query.email as string,
                    page: request.query.page ? Number(request.query.page) : 1,
                    size: request.query.size ? Number(request.query.size) : 1
               };

               const submitSearchContactConfirmation: Paginated<ContactOperationOutcome> | ResponseError = 
                    await ContactService.submitSearchContact(request.user!, searchContactRequest);

               response.status(200).json({ success: true, message: "Contacts retrieved successfully", data: submitSearchContactConfirmation });
          } catch (error) {
               next(error);
          }
     }

}