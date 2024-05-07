import { Address } from "@prisma/client";

// Representasi hasil operasi terkait address
export type AddressOperationOutcome = {
     id : number;
     country : string;
     city? : string;
     province? : string;
     street? : string;
     postal_code? : string;
}

// Request untuk membuat address baru
export type AddressCreateRequest = {
     contact_id : number;
     country : string;
     city? : string;
     province? : string;
     street? : string;
     postal_code? : string;
}

// Request untuk mendapatkan address
export type AddressGetRequest = {
     id : number;
     contact_id : number;
}

// Request untuk update address
export type AddressUpdateRequest = {
     id : number;
     contact_id : number;
     country : string;
     city? : string;
     province? : string;
     street : string;
     postal_code? : string;
}

// Request untuk menghapus address
export type AddressRemoveRequest = AddressGetRequest;

// Konveri data address menjadi hasil operasi address
export function convertToAddressResponseOutcome(payload : Address) : AddressOperationOutcome {
     return {
          id: payload.id, 
          country: payload.country, 
          city: payload.city || undefined,
          province: payload.province || undefined,
          street: payload.street || undefined,
          postal_code: payload.postal_code || undefined
     }
}