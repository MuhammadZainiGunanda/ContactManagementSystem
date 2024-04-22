import { prismaClient } from './../../src/app/database';

export class TestUtil {
     
     static async deleteUser() : Promise<void> {
          await prismaClient.user.deleteMany({
               where: { username: "testt" }
          });
     };

}