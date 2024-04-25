import { Contact } from '@prisma/client';
import { prismaClient } from './../../src/app/database';
import bcrypt from 'bcrypt';

export class TestUtil {
     
     static async deleteUser() : Promise<void> {
          await prismaClient.user.deleteMany({
               where: { username: "testt" }
          });
     };

     static async createUser() : Promise<void> {
          await prismaClient.user.create({
               data: { username: "testt", name: "testt", password: await bcrypt.hash("Testt", 10) }
          });
     };

     static async deleteContact() : Promise<void> {
          await prismaClient.contact.deleteMany({
               where: { username : "testt" }
          });
     }

     static async createContact() : Promise<void> {
          await prismaClient.contact.create({
               data: { first_name: "testt", last_name: "testt", email: "test@gmail.com", phone: "0879765476", username: "testt"}
          });
     }

     static async getContact() : Promise<Contact | null> {
          return prismaClient.contact.findFirst({
               where: { username: "testt" }
          });
     }

}