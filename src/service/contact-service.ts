import { Contact, User } from "@prisma/client";
import { ContactOperationOutcome, ContactCreateRequest, ContactSearchRequest, ContactUpdateRequest, Paginated, convertToContactResponseOutcome } from "../model/contact-management";
import { Validation } from "../validation/validation";
import { ContactInputValidationRules } from "../validation/contact-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class ContactService {
     
     static async submitCreateContact(userPayload: User, contactCreateRequest: ContactCreateRequest): Promise<ContactOperationOutcome> {
          Validation.validate(ContactInputValidationRules.CREATE_VALIDATION_RULES, contactCreateRequest);
     
          const createRecord: any = { 
               ...contactCreateRequest, ...{ username: userPayload.username }
          };
     
          const createContact: Contact = await prismaClient.contact.create({
               data: createRecord
          });
          
          return convertToContactResponseOutcome(createContact);
     }
     
     static async submitGetContact(userPayload: User, contactId: number): Promise<ContactOperationOutcome> {
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });

          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          return convertToContactResponseOutcome(checkContactMustExist);
     }
     
     static async submitUpdateContact(userPayload: User, inputContactUpdateRequest: ContactUpdateRequest): Promise<ContactOperationOutcome> {
          Validation.validate(ContactInputValidationRules.UPDATE_VALIDATION_RULES, inputContactUpdateRequest);
     
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputContactUpdateRequest.id }
          });
     
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          const updateRecord: Contact | null = await prismaClient.contact.update({
               where: { username: userPayload.username, id: inputContactUpdateRequest.id }, 
               data: inputContactUpdateRequest
          });
     
          return convertToContactResponseOutcome(updateRecord);
     }
     
     static async submitRemoveContact(userPayload: User, contactId: number): Promise<ContactOperationOutcome> {
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });

          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          const deleteRecord: Contact = await prismaClient.contact.delete({
               where: { username: userPayload.username, id: contactId }
          });

          return convertToContactResponseOutcome(deleteRecord);
     }

     static async submitSearchContact(userPayload: User, inputContactSearchRequest: ContactSearchRequest): Promise<Paginated<ContactOperationOutcome>> {
          Validation.validate(ContactInputValidationRules.SEARCH_VALIDATION_RULES, inputContactSearchRequest);

          const filterConditions: any[] = [];

          if (inputContactSearchRequest.name) {
               const nameFilter: any = {
                    OR: [
                         { first_name: { contains: inputContactSearchRequest.name } },
                         { last_name: { contains: inputContactSearchRequest.name } }
                    ]
               };
               filterConditions.push(nameFilter);
          }

          if (inputContactSearchRequest.email) {
               const emailFilter: any = { 
                    email: { contains: inputContactSearchRequest.email } 
               };
               filterConditions.push(emailFilter);
          }

          if (inputContactSearchRequest.phone) {
               const phoneFilter: any = { 
                    phone: { contains: inputContactSearchRequest.phone } 
               };
               filterConditions.push(phoneFilter);
          }

          const searchByFiltering: Contact[] = await prismaClient.contact.findMany({
               where: { 
                    username: userPayload.username, 
                    AND: filterConditions
               },
               skip: (inputContactSearchRequest.page -1) * inputContactSearchRequest.size,
               take: inputContactSearchRequest.size
          });
     
          const totalFilteredContacts: number = await prismaClient.contact.count({
               where: { 
                    username: userPayload.username, 
                    AND: filterConditions
               }
          });
     
          return { 
               data: searchByFiltering.map( data => convertToContactResponseOutcome(data)),
               paging: { 
                    size: inputContactSearchRequest.size,
                    total_page: Math.ceil(totalFilteredContacts / inputContactSearchRequest.size),
                    current_page: inputContactSearchRequest.size
               }
          };
     }

}