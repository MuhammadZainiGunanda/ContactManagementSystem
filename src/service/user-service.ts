import { User } from "@prisma/client";
import { prismaClient } from "../app/database";
import { ResponseError } from "../error/response-error";
import { UserLoginRequest, UserRegistrationRequest, UserUpdateRequest, UserOperationOutcome, convertToUserResponseOutcome } from "../model/user-management";
import { UserInputValidationRules } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";

export class UserService {

     static async submitUserRegistration(userRegistrationRequest: UserRegistrationRequest): Promise<UserOperationOutcome> {
          Validation.validate(UserInputValidationRules.REGISTRATION_VALIDATION_RULES, userRegistrationRequest);
     
          const totalUserWithSameUsername: number = await prismaClient.user.count({
               where: { username: userRegistrationRequest.username }
          });

          if (totalUserWithSameUsername != 0) {
               throw new ResponseError(401, "User already exists");
          }
     
          userRegistrationRequest.password = await bcrypt.hash(userRegistrationRequest.password, 10);
     
          const createUserRecord: User = await prismaClient.user.create({
               data: userRegistrationRequest
          });
     
          return convertToUserResponseOutcome(createUserRecord);
     }
     
     static async submitUserLogin(userLoginRequest: UserLoginRequest): Promise<UserOperationOutcome> {
          Validation.validate(UserInputValidationRules.LOGIN_VALIDATION_RULES, userLoginRequest);
     
          const checkUserInDatabase: User | null = await prismaClient.user.findUnique({
               where: { username: userLoginRequest.username }
          });
     
          if (!checkUserInDatabase) {
               throw new ResponseError(401, "Username or password is wrong");
          }
     
          const checkPasswordIsValid: boolean = await bcrypt.compare(userLoginRequest.password, checkUserInDatabase.password);
     
          if (!checkPasswordIsValid) {
               throw new ResponseError(401, "Username or password is wrong");
          }
     
          return convertToUserResponseOutcome(checkUserInDatabase);
     }
     
     static async submitGetUser(userGetRequest: User): Promise<UserOperationOutcome> {
          return convertToUserResponseOutcome(userGetRequest);
     }
     
     static async submitUpdateUser(userPayload: User, userUpdateRequest: UserUpdateRequest): Promise<UserOperationOutcome> {
          Validation.validate(UserInputValidationRules.UPDATE_VALIDATION_RULES, userUpdateRequest);
     
          if (userUpdateRequest.name) {
               userPayload.name = userUpdateRequest.name;
          };
     
          if (userUpdateRequest.password) {
               userPayload.password = await bcrypt.hash(userUpdateRequest.password, 10);
          }
     
          const updatedRecord: User = await prismaClient.user.update({
               where: { username: userPayload.username }, data: userUpdateRequest
          });
     
          return convertToUserResponseOutcome(updatedRecord);
     }

}