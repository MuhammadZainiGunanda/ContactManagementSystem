import { Contact } from "@prisma/client";

export type ContactOperationOutcome = {
     id : number;
     first_name : string;
     last_name? : string;
     email? : string;
     phone? : string;
}

export type InputContactCreate = {
     first_name : string;
     last_name? : string;
     email? : string;
     phone? : string;
}

export function convertToContactResponseOutcome(contactPayload : Contact) : ContactOperationOutcome {
     return { 
          id: contactPayload.id, 
          first_name: contactPayload.first_name, 
          last_name: contactPayload.last_name || undefined,
          email: contactPayload.email || undefined,
          phone: contactPayload.phone || undefined
     }
}