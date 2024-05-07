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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const contact_service_1 = require("../service/contact-service");
class ContactController {
    static createContact(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Panggil layanan untuk membuat kontak baru, dan nunggu konfirmasi
                const submitCreateContactConfirmation = yield contact_service_1.ContactService.submitCreateContact(request.user, request.body);
                // Jika berhasil, respons 200 serta data kontak baru
                response.status(200).json({ success: true, message: "Contact created successfully", data: submitCreateContactConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static getContact(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Panggil layanan untuk mendapatkan data kontak, dan nunggu konfirmasi
                const submitGetContactConfirmation = yield contact_service_1.ContactService.submitGetContact(request.user, Number(request.params.contactId));
                // Jika berhasil, respons 200 serta data kontak
                response.status(200).json({ success: true, message: "Contact retrieved successfully", data: submitGetContactConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static updateContact(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Prepare payload untuk update kontak
                const requestPayload = Object.assign({ id: Number(request.params.contactId) }, request.body);
                // Panggil layanan untuk update kontak dan nunggu konfirmasi
                const submitUpdateContactConfirmation = yield contact_service_1.ContactService.submitUpdateContact(request.user, requestPayload);
                // Jika berhasil, respons 200 serta data kontak yang telah diupdate
                response.status(200).json({ success: true, message: "Contact updated successfully", data: submitUpdateContactConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static removeContact(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Panggil layanan untuk proses delete kontak, dan nunggu konfirmasi
                const submitRemoveContactConfirmation = yield contact_service_1.ContactService.submitRemoveContact(request.user, Number(request.params.contactId));
                // Jika berhasil, respons 200 sebagai tanda proses delete kontak berhasil
                response.status(200).json({ success: true, message: "Contact removed successfully", data: {} });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static searchContact(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Prepare untuk request search kontak
                const searchContactRequest = {
                    name: request.query.name,
                    phone: request.query.phone,
                    email: request.query.email,
                    page: request.query.page ? Number(request.query.page) : 1,
                    size: request.query.size ? Number(request.query.size) : 1
                };
                // Panggil layanan untuk proses pencarian data kontak, dan nunggu konfirmasi
                const submitSearchContactConfirmation = yield contact_service_1.ContactService.submitSearchContact(request.user, searchContactRequest);
                // Jika berhasil, respons 200 serta hasil dari pencarian kontak
                response.status(200).json({ success: true, message: "Contacts retrieved successfully", data: submitSearchContactConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
}
exports.ContactController = ContactController;
