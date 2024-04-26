import { Contact } from "@prisma/client";

// Tipe data buat hasil operasi terkait
export type ContactOperationOutcome = {
     id : number;
     first_name : string;
     last_name? : string;
     email? : string;
     phone? : string;
}

// Tipe data buat request kontak baru
export type InputContactCreateRequest = {
     first_name : string;
     last_name? : string;
     email? : string;
     phone? : string;
}

// Tipe data buat update kontak
export type InputContactUpdateRequest = {
     id : number;
     first_name : string;
     last_name? : string;
     email : string;
     phone : string;
}

// Tipe data buat search kontak
export type InputContactSearchRequest = {
     name? : string;
     phone? : string;
     email? : string;
     page : number;
     size : number;
}

// Tipe data untuk info page dari hasil search
export type Page = {
     size : number;
     total_page : number;
     current_page : number;
}

// Tipe data buat hasil dari search kontak yang udah terpaging
export type Paginated<T> = {
     data : Array<T>;
     paging : Page;
}

// Method buat konveri kontak payload dari Prisma
export function convertToContactResponseOutcome(contactPayload : Contact) : ContactOperationOutcome {
     return { 
          id: contactPayload.id, 
          first_name: contactPayload.first_name, 
          last_name: contactPayload.last_name || undefined,
          email: contactPayload.email || undefined,
          phone: contactPayload.phone || undefined
     }
}