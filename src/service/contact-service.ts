import { Contact, User } from "@prisma/client";
import { ContactOperationOutcome, InputContactCreate, convertToContactResponseOutcome } from "../model/contact-management";
import { Validation } from "../validation/validation";
import { ContactInputValidationRules } from "../validation/contact-validation";
import { prismaClient } from "../app/database";

export class ContactService {
     
     static async submitCreateContact(user : User, inputContactCreateRequest : InputContactCreate) : Promise<ContactOperationOutcome> {
          Validation.validate(ContactInputValidationRules.CREATE_VALIDATION_RULES, inputContactCreateRequest);

          const createRecord : any = { 
               ...inputContactCreateRequest, ...{ username: user.username }
          };

          const createContact : Contact = await prismaClient.contact.create({
               data: createRecord
          });

          return convertToContactResponseOutcome(createContact);
     }

}