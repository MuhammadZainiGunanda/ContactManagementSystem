import { Contact } from "@prisma/client";

// Representasi hasil operasi terkait alamat
export type ContactOperationOutcome = {
     id : number;
     first_name : string;
     last_name? : string;
     email? : string;
     phone? : string;
}

// Request untuk membuat kontak
export type ContactCreateRequest = {
     first_name : string;
     last_name? : string;
     email? : string;
     phone? : string;
}

// Request untuk update kontak
export type ContactUpdateRequest = {
     id : number;
     first_name : string;
     last_name? : string;
     email : string;
     phone : string;
}

// Request untuk mencari kontak
export type ContactSearchRequest = {
     name? : string;
     phone? : string;
     email? : string;
     page : number;
     size : number;
}

// Representasi halaman untuk paginasi
export type Page = {
     size : number;
     total_page : number;
     current_page : number;
}

// Representasi untuk data yang telah di paginasi
export type Paginated<T> = {
     data : Array<T>;
     paging : Page;
}

// Konversi data kontak menjadi hasil operasi kontak
export function convertToContactResponseOutcome(contactPayload : Contact) : ContactOperationOutcome {
     return { 
          id: contactPayload.id, 
          first_name: contactPayload.first_name, 
          last_name: contactPayload.last_name || undefined,
          email: contactPayload.email || undefined,
          phone: contactPayload.phone || undefined
     }
}