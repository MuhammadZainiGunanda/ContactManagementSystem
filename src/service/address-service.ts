import { Address, Contact, User } from "@prisma/client";
import { AddressOperationOutcome, AddressCreateRequest, AddressGetRequest, convertToAddressResponseOutcome, AddressUpdateRequest, AddressRemoveRequest } from "../model/address-management";
import { Validation } from "../validation/validation";
import { AddressInputValidation } from "../validation/addresss-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class AddressService {

     static async submitCreateAddress(userPayload: User, inputAddressCreateRequest: AddressCreateRequest): Promise<AddressOperationOutcome> {
          Validation.validate(AddressInputValidation.CREATE_VALIDATION_RULES, inputAddressCreateRequest);
     
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressCreateRequest.contact_id }
          });
     
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
          
          const createRecord = await prismaClient.address.create({
               data: inputAddressCreateRequest
          });
     
          return convertToAddressResponseOutcome(createRecord);
     }
     
     static async submitGetAddress(userPayload: User, inputAddressGetRequest: AddressGetRequest): Promise<AddressOperationOutcome> {
          Validation.validate(AddressInputValidation.GET_VALIDATION_RULES, inputAddressGetRequest);
     
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressGetRequest.contact_id }
          });
     
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          const checkAddressMustExist: Address | null = await prismaClient.address.findFirst({
               where: { id: inputAddressGetRequest.id, contact_id: inputAddressGetRequest.contact_id }
          });
     
          if (!checkAddressMustExist) {
               throw new ResponseError(404, "Address not found");
          }
     
          return convertToAddressResponseOutcome(checkAddressMustExist);
     }

     static async submitUpdateAddress(userPayload: User, inputAddressUpdateRequest: AddressUpdateRequest): Promise<AddressOperationOutcome> {
          Validation.validate(AddressInputValidation.UPDATE_VALIDATION_RULES, inputAddressUpdateRequest);

          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressUpdateRequest.contact_id }
          });
     
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          const checkAddressMustExist: Address | null = await prismaClient.address.findFirst({
               where: { id: inputAddressUpdateRequest.id, contact_id: inputAddressUpdateRequest.contact_id }
          });
     
          if (!checkAddressMustExist) {
               throw new ResponseError(404, "Address not found");
          }

          const updateRecordAddress: Address = await prismaClient.address.update({
               where: { id: inputAddressUpdateRequest.id, contact_id: inputAddressUpdateRequest.contact_id },
               data: inputAddressUpdateRequest
          });

          return convertToAddressResponseOutcome(updateRecordAddress);
     }

     static async submitRemoveAddress(userPayload: User, inputAddressRemoveRequest: AddressRemoveRequest): Promise<AddressOperationOutcome> {
          Validation.validate(AddressInputValidation.REMOVE_VALIDAtION_RULES, inputAddressRemoveRequest);

          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressRemoveRequest.contact_id }
          });
     
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          const checkAddressMustExist: Address | null = await prismaClient.address.findFirst({
               where: { id: inputAddressRemoveRequest.id, contact_id: inputAddressRemoveRequest.contact_id }
          });
     
          if (!checkAddressMustExist) {
               throw new ResponseError(404, "Address not found");
          }

          const deleteRecordAddress: Address = await prismaClient.address.delete({
               where: { id: inputAddressRemoveRequest.id, contact_id: inputAddressRemoveRequest.contact_id }
          });

          return convertToAddressResponseOutcome(deleteRecordAddress);
     }

     static async submitlistAddressesByContact(userPayload: User, contactId: number): Promise<AddressOperationOutcome[]> {
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });
     
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }

          const addressesByContactId: Address[] = await prismaClient.address.findMany({
               where: { contact_id: contactId }
          });

          return addressesByContactId.map(record => convertToAddressResponseOutcome(record));
     }

}