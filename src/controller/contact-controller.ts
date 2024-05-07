import { ContactSearchRequest, Paginated } from './../model/contact-management';
import { NextFunction, Response } from "express";
import { ContactService } from "../service/contact-service";
import { RequestUserValidator } from "../types/request-middleware";
import { ContactOperationOutcome, ContactUpdateRequest } from "../model/contact-management";
import { ResponseError } from "../error/response-error";

export class ContactController {

     static async createContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk membuat kontak baru, dan nunggu konfirmasi
               const submitCreateContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitCreateContact(request.user!, request.body);

               // Jika berhasil, respons 200 serta data kontak baru
               response.status(200).json({ success: true, message: "Contact created successfully", data: submitCreateContactConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

     static async getContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Panggil layanan untuk mendapatkan data kontak, dan nunggu konfirmasi
               const submitGetContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitGetContact(request.user!, Number(request.params.contactId));

               // Jika berhasil, respons 200 serta data kontak
               response.status(200).json({ success: true, message: "Contact retrieved successfully", data: submitGetContactConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

     static async updateContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Prepare payload untuk update kontak
               const requestPayload: ContactUpdateRequest = {
                    id: Number(request.params.contactId),
                    ...request.body
               };

               // Panggil layanan untuk update kontak dan nunggu konfirmasi
               const submitUpdateContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitUpdateContact(request.user!, requestPayload);

               // Jika berhasil, respons 200 serta data kontak yang telah diupdate
               response.status(200).json({ success: true, message: "Contact updated successfully", data: submitUpdateContactConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

     static async removeContact(request: RequestUserValidator, response: Response, next: NextFunction) : Promise<void> {
          try {
               // Panggil layanan untuk proses delete kontak, dan nunggu konfirmasi
               const submitRemoveContactConfirmation: ContactOperationOutcome | ResponseError = 
                    await ContactService.submitRemoveContact(request.user!, Number(request.params.contactId));

               // Jika berhasil, respons 200 sebagai tanda proses delete kontak berhasil
               response.status(200).json({ success: true, message: "Contact removed successfully", data: {} });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

     static async searchContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Prepare untuk request search kontak
               const searchContactRequest : ContactSearchRequest = {
                    name: request.query.name as string,
                    phone: request.query.phone as string,
                    email: request.query.email as string,
                    page: request.query.page ? Number(request.query.page) : 1,
                    size: request.query.size ? Number(request.query.size) : 1
               };

               // Panggil layanan untuk proses pencarian data kontak, dan nunggu konfirmasi
               const submitSearchContactConfirmation: Paginated<ContactOperationOutcome> | ResponseError = 
                    await ContactService.submitSearchContact(request.user!, searchContactRequest);

               // Jika berhasil, respons 200 serta hasil dari pencarian kontak
               response.status(200).json({ success: true, message: "Contacts retrieved successfully", data: submitSearchContactConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

}