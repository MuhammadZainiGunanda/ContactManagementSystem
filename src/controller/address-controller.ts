import { RequestUserValidator } from './../types/request-middleware';
import { NextFunction, Response } from "express";
import { AddressOperationOutcome, AddressCreateRequest, AddressGetRequest, AddressUpdateRequest, AddressRemoveRequest } from "../model/address-management";
import { ResponseError } from "../error/response-error";
import { AddressService } from "../service/address-service";

export class AddressController {
     
     static async createAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const requestPayload: AddressCreateRequest = {
                    contact_id: Number(request.params.contactId),
                    ...request.body
               };

               const submitCreateAddressConfirmation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitCreateAddress(request.user!, requestPayload);

               response.status(200).json({ success: true, message: "Address created successfully", data: submitCreateAddressConfirmation });
          } catch (error) {
               next(error); 
          }
     }
     
     static async getAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const requestPayload: AddressGetRequest = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId)
               };
     
               const submitGetAddressConfirmation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitGetAddress(request.user!, requestPayload);
               
               response.status(200).json({ success: true, message: "Address retrieved successfully", data: submitGetAddressConfirmation });               
          } catch (error) {
               next(error); 
          }
     }

     static async updateAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const requestPayload: AddressUpdateRequest = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId),
                    ...request.body
               };

               const submitUpdateAddressConfirmation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitUpdateAddress(request.user!, requestPayload);

               response.status(200).json({ success: true, message: "Address updated successfully", data: submitUpdateAddressConfirmation });
          } catch (error) {
               next(error); 
          }
     }

     static async removeAddress(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const requestPayload: AddressRemoveRequest = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId)
               }

               const submitRemoveAddressConfimation: AddressOperationOutcome | ResponseError = 
                    await AddressService.submitRemoveAddress(request.user!, requestPayload);

               response.status(200).json({ success: true, message: "Address removed successfully", data: "OK" });
          } catch (error) {
               next(error); 
          }
     }

     static async getAddressesByContact(request: RequestUserValidator, response: Response, next: NextFunction): Promise<void> {
          try {
               const contactId: number = Number(request.params.contactId);
               
               const submitAddressListConfirmation: AddressOperationOutcome[] | ResponseError = 
                    await AddressService.submitlistAddressesByContact(request.user!, contactId);

               response.status(200).json({ success: true, message: "Addresses retrieved successfully", data: submitAddressListConfirmation });
          } catch (error) {
               next(error); 
          }
     }
     
}