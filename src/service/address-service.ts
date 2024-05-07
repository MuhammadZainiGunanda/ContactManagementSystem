import { Address, Contact, User } from "@prisma/client";
import { AddressOperationOutcome, AddressCreateRequest, AddressGetRequest, convertToAddressResponseOutcome, AddressUpdateRequest, AddressRemoveRequest } from "../model/address-management";
import { Validation } from "../validation/validation";
import { AddressInputValidation } from "../validation/addresss-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class AddressService {

     static async submitCreateAddress(userPayload: User, inputAddressCreateRequest: AddressCreateRequest): Promise<AddressOperationOutcome> {
          // Validasi input untuk pembuatan address
          Validation.validate(AddressInputValidation.CREATE_VALIDATION_RULES, inputAddressCreateRequest);
     
          // Cari kontak berdasarkan ID kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressCreateRequest.contact_id }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
          
          // Buat record address baru
          const createRecord = await prismaClient.address.create({
               data: inputAddressCreateRequest
          });
     
          // Konversi data address dan return
          return convertToAddressResponseOutcome(createRecord);
     }
     
     static async submitGetAddress(userPayload: User, inputAddressGetRequest: AddressGetRequest): Promise<AddressOperationOutcome> {
          // Validasi input untuk pengambilan address
          Validation.validate(AddressInputValidation.GET_VALIDATION_RULES, inputAddressGetRequest);
     
          // Cari kontak berdasarkan ID kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressGetRequest.contact_id }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          // Cari address berdasarkan ID, dan ID kontak
          const checkAddressMustExist: Address | null = await prismaClient.address.findFirst({
               where: { id: inputAddressGetRequest.id, contact_id: inputAddressGetRequest.contact_id }
          });
     
          // Jika address tidak ditemukan, lempar kesalahan
          if (!checkAddressMustExist) {
               throw new ResponseError(404, "Address not found");
          }
     
          // Konversi data address dan return
          return convertToAddressResponseOutcome(checkAddressMustExist);
     }

     static async submitUpdateAddress(userPayload: User, inputAddressUpdateRequest: AddressUpdateRequest): Promise<AddressOperationOutcome> {
          // Validasi input untuk update Address
          Validation.validate(AddressInputValidation.UPDATE_VALIDATION_RULES, inputAddressUpdateRequest);

          // Cari kontak berdasarkan ID kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressUpdateRequest.contact_id }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          // Cari address berdasarkan ID, dan ID kontak
          const checkAddressMustExist: Address | null = await prismaClient.address.findFirst({
               where: { id: inputAddressUpdateRequest.id, contact_id: inputAddressUpdateRequest.contact_id }
          });
     
          // Jika address tidak ditemukan, lempar kesalahan
          if (!checkAddressMustExist) {
               throw new ResponseError(404, "Address not found");
          }

          // Update record Address
          const updateRecordAddress: Address = await prismaClient.address.update({
               where: { id: inputAddressUpdateRequest.id, contact_id: inputAddressUpdateRequest.contact_id },
               data: inputAddressUpdateRequest
          });

          // Konveri data Address dan return
          return convertToAddressResponseOutcome(updateRecordAddress);
     }

     static async submitRemoveAddress(userPayload: User, inputAddressRemoveRequest: AddressRemoveRequest): Promise<AddressOperationOutcome> {
          // Validasi input untuk remove Address
          Validation.validate(AddressInputValidation.REMOVE_VALIDAtION_RULES, inputAddressRemoveRequest);

          // Cari kontak berdasarkan ID kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputAddressRemoveRequest.contact_id }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          // Cari address berdasarkan ID, dan ID kontak
          const checkAddressMustExist: Address | null = await prismaClient.address.findFirst({
               where: { id: inputAddressRemoveRequest.id, contact_id: inputAddressRemoveRequest.contact_id }
          });
     
          // Jika address tidak ditemukan, lempar kesalahan
          if (!checkAddressMustExist) {
               throw new ResponseError(404, "Address not found");
          }

          // Delete record address
          const deleteRecordAddress: Address = await prismaClient.address.delete({
               where: { id: inputAddressRemoveRequest.id, contact_id: inputAddressRemoveRequest.contact_id }
          });

          return convertToAddressResponseOutcome(deleteRecordAddress);
     }

     static async submitlistAddressesByContact(userPayload: User, contactId: number): Promise<AddressOperationOutcome[]> {
          // Cari kontak berdasarkan ID kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }

          // Temukan record address berdasarkan ID kontak
          const addressesByContactId: Address[] = await prismaClient.address.findMany({
               where: { contact_id: contactId }
          });

          // Konversi record address dan kembalikan
          return addressesByContactId.map(record => convertToAddressResponseOutcome(record));
     }

}