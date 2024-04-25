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

}