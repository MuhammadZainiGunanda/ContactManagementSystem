import { Address, Contact } from '@prisma/client';
import { prismaClient } from './../../src/app/database';
import bcrypt from 'bcrypt';

export class TestUtil {

     static async createUser() : Promise<void> {
          await prismaClient.user.create({
               data: { 
                    username: "testt", name: "testt", 
                    password: await bcrypt.hash("Testt", 10) 
               }
          });
     };
     
     static async deleteUser() : Promise<void> {
          await prismaClient.user.deleteMany({
               where: { username: "testt" }
          });
     };

     static async createContact() : Promise<void> {
          await prismaClient.contact.create({
               data: { 
                    first_name: "testt", last_name: "testt", email: "test@gmail.com", 
                    phone: "0879765476", username: "testt" 
               }
          });
     }

     static async getContact() : Promise<Contact | null> {
          return prismaClient.contact.findFirst({
               where: { username: "testt" }
          });
     }

     static async deleteContact() : Promise<void> {
          await prismaClient.contact.deleteMany({
               where: { first_name : "testt" }
          });
     }

     static async createAddress(contactId : number) : Promise<void> {
          await prismaClient.address.create({
               data: { 
                    country: "Indonesia", city: "Semarang", province: "Jawa Barat", 
                    street: "Jl. Sindang sana 7777", postal_code: "52156", contact_id: contactId
               }
          });
     }

     static async getAddress(contactId : number) : Promise<Address | null> {
          return prismaClient.address.findFirst({
               where: { contact_id: contactId }
          });
     }

     static async deleteAddress() : Promise<void> {
          await prismaClient.address.deleteMany({
               where: { city: "Semarang"}
          });
     }

}