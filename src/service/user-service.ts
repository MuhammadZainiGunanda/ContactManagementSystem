import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { InputUserLogin, InputUserRegistration, InputUserUpdate, UserOperationOutcome, convertToUserResponseOutcome } from "../model/user-management";
import { UserInputValidationRules } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";

export class UserService {

     static async submitUserRegistration(inputUserRegistration : InputUserRegistration) : Promise<UserOperationOutcome> {
          // Validasi input
          Validation.validate(UserInputValidationRules.REGISTRATION_VALIDATION_RULES, inputUserRegistration);

          // Check apakah user dengan username yang sama udah ada di database
          const totalUserWithSameUsername : number = await prismaClient.user.count({
               where: { username: inputUserRegistration.username }
          });

          if (totalUserWithSameUsername != 0) {
               throw new ResponseError(401, "User already exists");
          }

          // Jika Ok, enkripsi password sebelom save database
          inputUserRegistration.password = await bcrypt.hash(inputUserRegistration.password, 10);

          // Buat record user baru di database
          inputUserRegistration.password = await bcrypt.hash(inputUserRegistration.password, 10);

          const createUserRecord : User = await prismaClient.user.create({
               data: inputUserRegistration
          });

          // Konveri record user baru dan return
          return convertToUserResponseOutcome(createUserRecord);
     }

     static async submitUserLogin(inputUserLogin : InputUserLogin) : Promise<UserOperationOutcome> {
          // Validasi input
          Validation.validate(UserInputValidationRules.LOGIN_VALIDATION_RULES, inputUserLogin);

          // Check apakah username yang di kirimkan ada didatabase
          const checkUserInDatabase : User | null = await prismaClient.user.findUnique({
               where: { username: inputUserLogin.username }
          });

          if (!checkUserInDatabase) {
               throw new ResponseError(401, "Username or password is wrong");
          }

          // Check apakah password cocok dengan password terenkripsi di database
          const checkPasswordIsValid : boolean = await bcrypt.compare(inputUserLogin.password, checkUserInDatabase.password);

          if (!checkPasswordIsValid) {
               throw new ResponseError(401, "Username or password is wrong");
          }

          // Jika OK, konveri record user dan return
          return convertToUserResponseOutcome(checkUserInDatabase);
     }

     static async submitGetUser(inputGetUser : User) : Promise<UserOperationOutcome> {
          // Jika proses Auth berhasil, konveri record dan return
          return convertToUserResponseOutcome(inputGetUser);
     }

     static async submitUpdateUser(user : User, inputUpdateUser : InputUserUpdate) : Promise<UserOperationOutcome> {
          // Validasi input
          Validation.validate(UserInputValidationRules.UPDATE_VALIDATION_RULES, inputUpdateUser);

          // Jika yang diberikan data name, update info user berdasarkan input yang diberikan
          Validation.validate(UserInputValidationRules.UPDATE_VALIDATION_RULES, inputUpdateUser);

          if (inputUpdateUser.name) {
               user.name = inputUpdateUser.name;
          };

          // Jika yang diberikan data password, update info user berdasarkan input yang diberikan
          if (inputUpdateUser.password) {
               user.password = await bcrypt.hash(inputUpdateUser.password, 10);
          }

          // Update record user di database
          const updatedRecord : User = await prismaClient.user.update({
               where: { username: user.username }, data : inputUpdateUser
          });

          // Jik OK, konveri record dari hasil update dan return
          return convertToUserResponseOutcome(updatedRecord);
     }

}