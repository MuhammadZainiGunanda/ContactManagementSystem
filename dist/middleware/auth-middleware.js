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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../app/database");
function authMiddleware(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ambil token user dari cookie
        const userToken = request.cookies["login"];
        // Jika token user ada
        if (userToken) {
            try {
                // Dekode token JWT untuk mendapatkan payload
                const decodeToken = jsonwebtoken_1.default.verify(userToken, process.env.TOKEN_SECRET_KEY);
                // Cari user berdasarkan username dalam token
                const findUser = yield database_1.prismaClient.user.findUnique({
                    where: { username: decodeToken.username }
                });
                // Jika user tidak ditemukan dalam database, kembalikan respons error
                if (!findUser) {
                    response.status(400).json({ success: false, message: "Access denied", data: {} });
                }
                // Jika user ditemukan, tambahkan informasi user ke dalam objek request dan lanjutkan ke middleware berikutnya
                request.user = findUser;
                next();
            }
            catch (error) {
                // Jika terjadi kesalahan dalam verifikasi token, kembalikan respons error
                response.status(400).json({ success: false, message: "Access denied", data: {} });
            }
        }
        else {
            // Jika tidak ada token user, lempar respons error
            response.status(400).json({ success: false, message: "Access denied", data: {} });
        }
    });
}
exports.authMiddleware = authMiddleware;
