import { Contact, User } from "@prisma/client";
import { ContactOperationOutcome, InputContactCreateRequest, InputContactUpdateRequest, convertToContactResponseOutcome } from "../model/contact-management";
import { Validation } from "../validation/validation";
import { ContactInputValidationRules } from "../validation/contact-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class ContactService {
     
     static async submitCreateContact(userPayload : User, inputContactCreateRequest : InputContactCreateRequest) : Promise<ContactOperationOutcome> {
          Validation.validate(ContactInputValidationRules.CREATE_VALIDATION_RULES, inputContactCreateRequest);

          const createRecord : any = { 
               ...inputContactCreateRequest, ...{ username: userPayload.username }
          };

          const createContact : Contact = await prismaClient.contact.create({
               data: createRecord
          });

          return convertToContactResponseOutcome(createContact);
     }

     static async submitGetContact(userPayload : User, contactId : number) : Promise<ContactOperationOutcome> {
          const checkContactMustExist : Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });

          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }

          return convertToContactResponseOutcome(checkContactMustExist);
     }

     static async submitUpdateContact(userPayload : User, inputContactUpdateRequest : InputContactUpdateRequest) : Promise<ContactOperationOutcome> {
          Validation.validate(ContactInputValidationRules.UPDATE_VALIDATION_RULES, inputContactUpdateRequest);

          const checkContactMustExist : Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputContactUpdateRequest.id }
          });

          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }

          const updateRecord : Contact | null = await prismaClient.contact.update({
               where: { username: userPayload.username, id: inputContactUpdateRequest.id }, data: inputContactUpdateRequest
          });

          return convertToContactResponseOutcome(updateRecord);
     }

     static async submitRemoveContact(userPayload : User, contactId : number) : Promise<ContactOperationOutcome> {
          const checkContactMustExist : Contact  | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });

          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }

          const deleteRecord : Contact = await prismaClient.contact.delete({
               where: { username: userPayload.username, id: contactId }
          });

          return convertToContactResponseOutcome(deleteRecord);
     }

}