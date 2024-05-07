import { RequestUserValidator } from './../types/request-middleware';
import { NextFunction, Response } from "express";
import { AddressOperationOutcome, AddressCreateRequest, AddressGetRequest, AddressUpdateRequest, AddressRemoveRequest } from "../model/address-management";
import { ResponseError } from "../error/response-error";
import { AddressService } from "../service/address-service";

export class AddressController {
     
     static async createAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Prepare payload untuk membuat address
               const requestPayload: AddressCreateRequest = {
                    contact_id: Number(request.params.contactId),
                    ...request.body
               };
     
               // Panggil layanan untuk membuat address, dan tunggu konfirmasi
               const submitCreateAddressConfirmation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitCreateAddress(request.user!, requestPayload);
     
               // Jika berhasil, kirim respons 200 beserta data baru
               response.status(200).json({ success: true, message: "Address created successfully", data: submitCreateAddressConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }
     
     static async getAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Prepare payload untuk mendapatkan address
               const requestPayload: AddressGetRequest = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId)
               };
     
               // Panggil layanan untuk mendapatkan address, dan tunggu konfirmasi
               const submitGetAddressConfirmation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitGetAddress(request.user!, requestPayload);
     
               // Kirim respons 200 bersama dengan hasil dari permintaan address
               response.status(200).json({ success: true, message: "Address retrieved successfully", data: submitGetAddressConfirmation });               
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

     static async updateAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Prepare payload untuk update address
               const requestPayload: AddressUpdateRequest = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId),
                    ...request.body
               };

               // Panggil layanan untuk update address, dan tunggu konfirmasi
               const submitUpdateAddressConfirmation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitUpdateAddress(request.user!, requestPayload);

               // Kirim respons 200 bersama data baru yang telah di update
               response.status(200).json({ success: true, message: "Address updated successfully", data: submitUpdateAddressConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

     static async removeAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Prepare payload untuk remove address
               const requestPayload: AddressRemoveRequest = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId)
               }

               // Panggil layanan untuk prosess hapus address, dan nunggu konfirmasi
               const submitRemoveAddressConfimation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitRemoveAddress(request.user!, requestPayload);

               // Kirim respons 200 sebagai tanda prosess berhasil
               response.status(200).json({ success: true, message: "Address removed successfully", data: "OK" });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }

     static async getAddressesByContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               // Mendapatkan ID kontak dari parameter permintaan
               const contactId: number = Number(request.params.contactId);

               // Panggil layanan untuk prosess mendapatkan daftar record, dan nunggu konfirmasi
               const submitAddressListConfirmation: AddressOperationOutcome[] | ResponseError = 
                    await AddressService.submitlistAddressesByContact(request.user!, contactId);

               response.status(200).json({ success: true, message: "Addresses retrieved successfully", data: submitAddressListConfirmation });
          } catch (error) {
               next(error); // Lewatkan Error ke middleware berikutnya
          }
     }
     
}