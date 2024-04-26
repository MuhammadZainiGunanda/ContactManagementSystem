import { InputContactSearchRequest, Paginated } from './../model/contact-management';
import { NextFunction, Response } from "express";
import { ContactService } from "../service/contact-service";
import { RequestUserValidator } from "../types/request-middleware";
import { ContactOperationOutcome, InputContactUpdateRequest } from "../model/contact-management";
import { ResponseError } from "../error/response-error";

export class ContactController {

     static async createContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Manggil layanan untuk membuat kontak baru, dan nunggu konfirmasi
               const submitCreateContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitCreateContact(request.user!, request.body);

               // Jika OK, respons 200 serta data kontak baru
               response.status(200).json({ data: submitCreateContactConfirmation });
          } catch (error) {
               next(error); // Teruskan Error ke middlware selanjutnya
          }
     }

     static async getContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Manggil layanan untuk mendapatkan data kontak, dan nunggu konfirmasi
               const submitGetContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitGetContact(request.user!, Number(request.params.contactId));

               // Jika OK, respons 200 serta data kontak
               response.status(200).json({ data: submitGetContactConfirmation });
          } catch (error) {
               next(error); // Lempar Error ke middlware selanjutnya
          }
     }

     static async updateContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Prepare payload untuk update kontak
               const requestPayload : InputContactUpdateRequest = request.body as InputContactUpdateRequest;
               requestPayload.id = Number(request.params.contactId);

               // Manggil layanan untuk update kontak dan nunggu konfirmasi
               const submitUpdateContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitUpdateContact(request.user!, requestPayload);

               // Jika OK, respons 200 serta data kontak yang telah diupdate
               response.status(200).json({ data: submitUpdateContactConfirmation });
          } catch (error) {
               next(error); // Lempar Error ke middlware selanjutnya
          }
     }

     static async removeContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Manggil layanan untuk proses delete kontak, dan nunggu konfirmasi
               const submitRemoveContactConfirmation : ContactOperationOutcome | ResponseError = 
                    await ContactService.submitRemoveContact(request.user!, Number(request.params.contactId));

               // Jika OK, respons 200 sebagai tanda proses delete kontak berhasil
               response.status(200).json({ data: "Successfully" });
          } catch (error) {
               next(error); // Lempar Error ke middlware selanjutnya
          }
     }

     static async searchContact(request : RequestUserValidator, response : Response, next : NextFunction) : Promise<void> {
          try {
               // Prepare untuk request search kontak
               const searchContactRequest : InputContactSearchRequest = {
                    name: request.query.name as string,
                    phone: request.query.phone as string,
                    email: request.query.email as string,
                    page: request.query.page ? Number(request.query.page) : 1,
                    size: request.query.size ? Number(request.query.size) : 1
               }

               // Manggil layanan untuk proses pencarian data kontak, dan nunggu konfirmasi
               const submitSearchContactConfirmation : Paginated<ContactOperationOutcome> | ResponseError = 
                    await ContactService.submitSearchContact(request.user!, searchContactRequest);

               // Jika OK, respons 200 serta hasil dari pencarian kontak
               response.status(200).json(submitSearchContactConfirmation);
          } catch (error) {
               next(error); // Lempar Error ke middlware selanjutnya
          }
     }

}