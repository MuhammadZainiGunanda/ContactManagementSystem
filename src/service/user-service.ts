import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { UserLoginRequest, UserRegistrationRequest, UserUpdateRequest, UserOperationOutcome, convertToUserResponseOutcome } from "../model/user-management";
import { UserInputValidationRules } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";

export class UserService {

     static async submitUserRegistration(userRegistrationRequest: UserRegistrationRequest): Promise<UserOperationOutcome> {
          // Validasi input registrasi user
          Validation.validate(UserInputValidationRules.REGISTRATION_VALIDATION_RULES, userRegistrationRequest);
     
          // Periksa apakah user dengan nama user yang sama sudah ada dalam database
          const totalUserWithSameUsername: number = await prismaClient.user.count({
               where: { username: userRegistrationRequest.username }
          });
     
          // Jika user dengan nama user yang sama sudah ada, lemparkan error
          if (totalUserWithSameUsername != 0) {
               throw new ResponseError(401, "User already exists");
          }
     
          // Jika tidak ada masalah, enkripsi kata sandi sebelum menyimpan ke database
          userRegistrationRequest.password = await bcrypt.hash(userRegistrationRequest.password, 10);
     
          // Buat record user baru dalam database
          const createUserRecord: User = await prismaClient.user.create({
               data: userRegistrationRequest
          });
     
          // Konversi record user baru dan kembalikan
          return convertToUserResponseOutcome(createUserRecord);
     }
     
     static async submitUserLogin(userLoginRequest: UserLoginRequest): Promise<UserOperationOutcome> {
          // Validasi input login user
          Validation.validate(UserInputValidationRules.LOGIN_VALIDATION_RULES, userLoginRequest);
     
          // Periksa apakah nama user yang diberikan ada dalam database
          const checkUserInDatabase: User | null = await prismaClient.user.findUnique({
               where: { username: userLoginRequest.username }
          });
     
          // Jika nama user tidak ditemukan dalam database, lemparkan error
          if (!checkUserInDatabase) {
               throw new ResponseError(401, "Username or password is wrong");
          }
     
          // Periksa apakah kata sandi cocok dengan kata sandi yang terenkripsi dalam database
          const checkPasswordIsValid: boolean = await bcrypt.compare(userLoginRequest.password, checkUserInDatabase.password);
     
          // Jika kata sandi tidak cocok, lemparkan error
          if (!checkPasswordIsValid) {
               throw new ResponseError(401, "Username or password is wrong");
          }
     
          // Jika tidak ada masalah, konversi record user dan kembalikan
          return convertToUserResponseOutcome(checkUserInDatabase);
     }
     
     static async submitGetUser(userGetRequest: User): Promise<UserOperationOutcome> {
          // Jika autentikasi berhasil, konversi record dan kembalikan
          return convertToUserResponseOutcome(userGetRequest);
     }
     
     static async submitUpdateUser(userPayload: User, userUpdateRequest: UserUpdateRequest): Promise<UserOperationOutcome> {
          // Validasi input pembaruan user
          Validation.validate(UserInputValidationRules.UPDATE_VALIDATION_RULES, userUpdateRequest);
     
          // Jika data name diberikan, perbarui informasi user berdasarkan input yang diberikan
          if (userUpdateRequest.name) {
               userPayload.name = userUpdateRequest.name;
          };
     
          // Jika data password diberikan, perbarui informasi user berdasarkan input yang diberikan
          if (userUpdateRequest.password) {
               userPayload.password = await bcrypt.hash(userUpdateRequest.password, 10);
          }
     
          // Perbarui record user dalam database
          const updatedRecord: User = await prismaClient.user.update({
               where: { username: userPayload.username }, data: userUpdateRequest
          });
     
          // Jika tidak ada masalah, konversi record dari hasil pembaruan dan kembalikan
          return convertToUserResponseOutcome(updatedRecord);
     }

}