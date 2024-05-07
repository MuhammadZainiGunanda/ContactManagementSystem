"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../app/database");
const response_error_1 = require("../error/response-error");
const user_management_1 = require("../model/user-management");
const user_validation_1 = require("../validation/user-validation");
const validation_1 = require("../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static submitUserRegistration(userRegistrationRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi input registrasi user
            validation_1.Validation.validate(user_validation_1.UserInputValidationRules.REGISTRATION_VALIDATION_RULES, userRegistrationRequest);
            // Periksa apakah user dengan nama user yang sama sudah ada dalam database
            const totalUserWithSameUsername = yield database_1.prismaClient.user.count({
                where: { username: userRegistrationRequest.username }
            });
            // Jika user dengan nama user yang sama sudah ada, lemparkan error
            if (totalUserWithSameUsername != 0) {
                throw new response_error_1.ResponseError(401, "User already exists");
            }
            // Jika tidak ada masalah, enkripsi kata sandi sebelum menyimpan ke database
            userRegistrationRequest.password = yield bcrypt_1.default.hash(userRegistrationRequest.password, 10);
            // Buat record user baru dalam database
            const createUserRecord = yield database_1.prismaClient.user.create({
                data: userRegistrationRequest
            });
            // Konversi record user baru dan kembalikan
            return (0, user_management_1.convertToUserResponseOutcome)(createUserRecord);
        });
    }
    static submitUserLogin(userLoginRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi input login user
            validation_1.Validation.validate(user_validation_1.UserInputValidationRules.LOGIN_VALIDATION_RULES, userLoginRequest);
            // Periksa apakah nama user yang diberikan ada dalam database
            const checkUserInDatabase = yield database_1.prismaClient.user.findUnique({
                where: { username: userLoginRequest.username }
            });
            // Jika nama user tidak ditemukan dalam database, lemparkan error
            if (!checkUserInDatabase) {
                throw new response_error_1.ResponseError(401, "Username or password is wrong");
            }
            // Periksa apakah kata sandi cocok dengan kata sandi yang terenkripsi dalam database
            const checkPasswordIsValid = yield bcrypt_1.default.compare(userLoginRequest.password, checkUserInDatabase.password);
            // Jika kata sandi tidak cocok, lemparkan error
            if (!checkPasswordIsValid) {
                throw new response_error_1.ResponseError(401, "Username or password is wrong");
            }
            // Jika tidak ada masalah, konversi record user dan kembalikan
            return (0, user_management_1.convertToUserResponseOutcome)(checkUserInDatabase);
        });
    }
    static submitGetUser(userGetRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Jika autentikasi berhasil, konversi record dan kembalikan
            return (0, user_management_1.convertToUserResponseOutcome)(userGetRequest);
        });
    }
    static submitUpdateUser(userPayload, userUpdateRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi input pembaruan user
            validation_1.Validation.validate(user_validation_1.UserInputValidationRules.UPDATE_VALIDATION_RULES, userUpdateRequest);
            // Jika data name diberikan, perbarui informasi user berdasarkan input yang diberikan
            if (userUpdateRequest.name) {
                userPayload.name = userUpdateRequest.name;
            }
            ;
            // Jika data password diberikan, perbarui informasi user berdasarkan input yang diberikan
            if (userUpdateRequest.password) {
                userPayload.password = yield bcrypt_1.default.hash(userUpdateRequest.password, 10);
            }
            // Perbarui record user dalam database
            const updatedRecord = yield database_1.prismaClient.user.update({
                where: { username: userPayload.username }, data: userUpdateRequest
            });
            // Jika tidak ada masalah, konversi record dari hasil pembaruan dan kembalikan
            return (0, user_management_1.convertToUserResponseOutcome)(updatedRecord);
        });
    }
}
exports.UserService = UserService;
