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
exports.UserController = void 0;
const user_service_1 = require("../service/user-service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    static registrationUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Panggil layanan untuk proses pembuatan user baru, dan tunggu konfirmasi
                const registrationConfirmation = yield user_service_1.UserService.submitUserRegistration(request.body);
                // Jika berhasil, kirim respons 200 bersama dengan data konfirmasi
                response.status(200).json({ success: true, message: "Register successfully", data: registrationConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static loginUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Panggil layanan untuk proses login user, dan tunggu konfirmasi
                const loginUserConfirmation = yield user_service_1.UserService.submitUserLogin(request.body);
                // Jika berhasil, buat token JWT dengan data konfirmasi login, dan atur waktu kedaluwarsa
                const createToken = jsonwebtoken_1.default.sign(Object.assign({}, loginUserConfirmation), process.env.TOKEN_SECRET_KEY, { expiresIn: process.env.EXPIRES_IN });
                // Atur cookie dengan token JWT untuk otentikasi sesi
                response.cookie("login", createToken, { httpOnly: true, secure: true, sameSite: "strict" })
                    .status(200).json({ success: true, message: "User logged in successfully", data: loginUserConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static getUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Panggil layanan untuk mendapatkan data user, dan tunggu konfirmasi
                const getUserConfirmation = yield user_service_1.UserService.submitGetUser(request.user);
                // Jika berhasil, kirim respons 200 bersama dengan data konfirmasi
                response.status(200).json({ success: true, message: "User data retrieved successfully", data: getUserConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static updateUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Panggil layanan untuk proses pembaruan data user, dan tunggu konfirmasi
                const updateUserConfirmation = yield user_service_1.UserService.submitUpdateUser(request.user, request.body);
                // Jika berhasil, kirim respons 200 bersama dengan data konfirmasi
                response.status(200).json({ success: true, message: "User data updated successfully", data: updateUserConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static logoutUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Hapus cookie, dan kirim respons 200 sebagai tanda proses logout berhasil
                response.clearCookie("login").status(200).json({ success: true, message: "User logged out successfully", data: "OK" });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
}
exports.UserController = UserController;
