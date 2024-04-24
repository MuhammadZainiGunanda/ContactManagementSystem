import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { InputUserLogin, InputUserRegistration, InputUserUpdate, UserOperationOutcome, convertToUserResponseOutcome } from "../model/user-management";
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
               throw new ResponseError(401, "User already exists");
          }

          inputUserRegistration.password = await bcrypt.hash(inputUserRegistration.password, 10);

          const createUserRecord : User = await prismaClient.user.create({
               data: inputUserRegistration
          });

          return convertToUserResponseOutcome(createUserRecord);
     }

     static async submitUserLogin(inputUserLogin : InputUserLogin) : Promise<UserOperationOutcome> {
          Validation.validate(UserInputValidationRules.LOGIN_VALIDATION_RULES, inputUserLogin);

          const checkUserInDatabase : User | null = await prismaClient.user.findUnique({
               where: { username: inputUserLogin.username }
          });

          if (!checkUserInDatabase) {
               throw new ResponseError(401, "Username or password is wrong");
          }

          const checkPasswordIsValid : boolean = await bcrypt.compare(inputUserLogin.password, checkUserInDatabase.password);

          if (!checkPasswordIsValid) {
               throw new ResponseError(401, "Username or password is wrong");
          }

          return convertToUserResponseOutcome(checkUserInDatabase);
     }

     static async submitGetUser(inputGetUser : User) : Promise<UserOperationOutcome> {
          return convertToUserResponseOutcome(inputGetUser);
     }

     static async submitUpdateUser(user : User, inputUpdateUser : InputUserUpdate) : Promise<UserOperationOutcome> {
          Validation.validate(UserInputValidationRules.UPDATE_VALIDATION_RULES, inputUpdateUser);

          if (inputUpdateUser.name) {
               user.name = inputUpdateUser.name;
          };

          if (inputUpdateUser.password) {
               user.password = await bcrypt.hash(inputUpdateUser.password, 10);
          }

          const updatedRecord : User = await prismaClient.user.update({
               where: { username: user.username }, data : inputUpdateUser
          });

          return convertToUserResponseOutcome(updatedRecord);
     }

}