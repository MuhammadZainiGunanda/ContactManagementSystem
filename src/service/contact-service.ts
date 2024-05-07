import { Contact, User } from "@prisma/client";
import { ContactOperationOutcome, ContactCreateRequest, ContactSearchRequest, ContactUpdateRequest, Paginated, convertToContactResponseOutcome } from "../model/contact-management";
import { Validation } from "../validation/validation";
import { ContactInputValidationRules } from "../validation/contact-validation";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";

export class ContactService {
     
     static async submitCreateContact(userPayload: User, contactCreateRequest: ContactCreateRequest): Promise<ContactOperationOutcome> {
          // Melakukan Validasi input
          Validation.validate(ContactInputValidationRules.CREATE_VALIDATION_RULES, contactCreateRequest);
     
          // Prepare data untuk membuat kontak baru, termasuk menambahkan nama user dari payload user
          const createRecord: any = { 
               ...contactCreateRequest, ...{ username: userPayload.username }
          };
     
          // Buat kontak baru di database
          const createContact: Contact = await prismaClient.contact.create({
               data: createRecord
          });
          
          // Konversi kontak, dan return hasilnya
          return convertToContactResponseOutcome(createContact);
     }
     
     static async submitGetContact(userPayload: User, contactId: number): Promise<ContactOperationOutcome> {
          // Cari kontak berdasarkan ID kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          // Konversi kontak, dan return hasilnya
          return convertToContactResponseOutcome(checkContactMustExist);
     }
     
     static async submitUpdateContact(userPayload: User, inputContactUpdateRequest: ContactUpdateRequest): Promise<ContactOperationOutcome> {
          // Melakukan validasi input
          Validation.validate(ContactInputValidationRules.UPDATE_VALIDATION_RULES, inputContactUpdateRequest);
     
          // Cari Kontak berdasarkan ID Kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: inputContactUpdateRequest.id }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          // Then jika berhasil, update Record kontak dengan data baru di dalam database
          const updateRecord: Contact | null = await prismaClient.contact.update({
               where: { username: userPayload.username, id: inputContactUpdateRequest.id }, 
               data: inputContactUpdateRequest
          });
     
          // Konversi kontak, dan return hasilnya
          return convertToContactResponseOutcome(updateRecord);
     }
     
     static async submitRemoveContact(userPayload: User, contactId: number): Promise<ContactOperationOutcome> {
          // Cari Kontak berdasarkan ID Kontak dan username dari User payload
          const checkContactMustExist: Contact | null = await prismaClient.contact.findFirst({
               where: { username: userPayload.username, id: contactId }
          });
     
          // Jika kontak tidak ditemukan, lempar kesalahan
          if (!checkContactMustExist) {
               throw new ResponseError(404, "Contact not found");
          }
     
          // Hapus record kontak dari dalam database
          const deleteRecord: Contact = await prismaClient.contact.delete({
               where: { username: userPayload.username, id: contactId }
          });
                    
          // Konversi kontak, dan return hasilnya
          return convertToContactResponseOutcome(deleteRecord);
     }

     static async submitSearchContact(userPayload: User, inputContactSearchRequest: ContactSearchRequest): Promise<Paginated<ContactOperationOutcome>> {
          // Melakukan validasi input
          Validation.validate(ContactInputValidationRules.SEARCH_VALIDATION_RULES, inputContactSearchRequest);

          // Prepare filter conditions
          const filterConditions: any[] = [];

          // Check jika ada Nama yang dicari
          if (inputContactSearchRequest.name) {
               // Buat kondisi filter untuk mencari Nama
               const nameFilter: any = {
                    OR: [
                         { first_name: { contains: inputContactSearchRequest.name } },
                         { last_name: { contains: inputContactSearchRequest.name } }
                    ]
               };

               filterConditions.push(nameFilter); // Tambahkan kondisi filter ke dalam array
          }

          // Check jika ada Email yang dicari
          if (inputContactSearchRequest.email) {
               // Buat filter untuk mencari Email
               const emailFilter: any = { 
                    email: { contains: inputContactSearchRequest.email } 
               };

               filterConditions.push(emailFilter); // Tambahkan kondisi filter ke dalam array
          }

          // Check if ada Phone yang dicari
          if (inputContactSearchRequest.phone) {
               // Buat filter untuk mencari Email
               const phoneFilter: any = { 
                    phone: { contains: inputContactSearchRequest.phone } 
               };

               filterConditions.push(phoneFilter);

          }

          // Lakukan pencarian berdasarkan kondisi filter
          const searchByFiltering: Contact[] = await prismaClient.contact.findMany({
               where: { 
                    username: userPayload.username, 
                    AND: filterConditions // Gabungkan kondisi filter dengan operator AND
               },
               skip: (inputContactSearchRequest.page -1) * inputContactSearchRequest.size, // Hitung jumlah data yang akan diskip (paging)
               take: inputContactSearchRequest.size // Ambil jumlah data yang sesuai dengan ukuran page
          });

          // Hitung total jumlah data yang sesuai dengan kondisi filter
          const totalFilteredContacts: number = await prismaClient.contact.count({
               where: { 
                    username: userPayload.username, 
                    AND: filterConditions // Gabungkan kondisi filter dengan operator AND
               }
               // Tidak gunakan Skip & Take, karena operasi ini hanya untuk menjumlahkan data record dari impact berdasarkan,
               // kondisi tertentu.
          });

          // Konversi data dan siapkan data paging
          return { 
               data: searchByFiltering.map( data => convertToContactResponseOutcome(data)),
               paging: { 
                    size: inputContactSearchRequest.size, // Ukuran page
                    total_page: Math.ceil(totalFilteredContacts / inputContactSearchRequest.size), // Total page
                    current_page: inputContactSearchRequest.size // Page saat ini
               }
          };
     }

}