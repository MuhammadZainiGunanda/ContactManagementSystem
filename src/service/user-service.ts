import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { InputUserRegistration, UserOperationOutcome, convertToUserResponseOutcome } from "../model/user-management";
import { UserInputValidationRules } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";

export class UserService {

     static async submitUserRegistration(inputUserRegistration : InputUserRegistration) : Promise<UserOperationOutcome> {
          Validation.validate(UserInputValidationRules.REGISTRATION_VALIDATION_RULES, inputUserRegistration);

          const totalUserWithSameUsername : number = await prismaClient.user.count({
               where: { username: inputUserRegistration.username }
          });

          if (totalUserWithSameUsername != 0) {
               throw new ResponseError(400, "Username already exists");
          }

          inputUserRegistration.password = await bcrypt.hash(inputUserRegistration.password, 10);

          const createUserRecord : User = await prismaClient.user.create({
               data: inputUserRegistration
          });

          return convertToUserResponseOutcome(createUserRecord);
     }

}