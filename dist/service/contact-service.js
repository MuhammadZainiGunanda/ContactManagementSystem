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
exports.ContactService = void 0;
const contact_management_1 = require("../model/contact-management");
const validation_1 = require("../validation/validation");
const contact_validation_1 = require("../validation/contact-validation");
const database_1 = require("../app/database");
const response_error_1 = require("../error/response-error");
class ContactService {
    static submitCreateContact(userPayload, contactCreateRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Melakukan Validasi input
            validation_1.Validation.validate(contact_validation_1.ContactInputValidationRules.CREATE_VALIDATION_RULES, contactCreateRequest);
            // Prepare data untuk membuat kontak baru, termasuk menambahkan nama user dari payload user
            const createRecord = Object.assign(Object.assign({}, contactCreateRequest), { username: userPayload.username });
            // Buat kontak baru di database
            const createContact = yield database_1.prismaClient.contact.create({
                data: createRecord
            });
            // Konversi kontak, dan return hasilnya
            return (0, contact_management_1.convertToContactResponseOutcome)(createContact);
        });
    }
    static submitGetContact(userPayload, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cari kontak berdasarkan ID kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: contactId }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Konversi kontak, dan return hasilnya
            return (0, contact_management_1.convertToContactResponseOutcome)(checkContactMustExist);
        });
    }
    static submitUpdateContact(userPayload, inputContactUpdateRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Melakukan validasi input
            validation_1.Validation.validate(contact_validation_1.ContactInputValidationRules.UPDATE_VALIDATION_RULES, inputContactUpdateRequest);
            // Cari Kontak berdasarkan ID Kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: inputContactUpdateRequest.id }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Then jika berhasil, update Record kontak dengan data baru di dalam database
            const updateRecord = yield database_1.prismaClient.contact.update({
                where: { username: userPayload.username, id: inputContactUpdateRequest.id },
                data: inputContactUpdateRequest
            });
            // Konversi kontak, dan return hasilnya
            return (0, contact_management_1.convertToContactResponseOutcome)(updateRecord);
        });
    }
    static submitRemoveContact(userPayload, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cari Kontak berdasarkan ID Kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: contactId }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Hapus record kontak dari dalam database
            const deleteRecord = yield database_1.prismaClient.contact.delete({
                where: { username: userPayload.username, id: contactId }
            });
            // Konversi kontak, dan return hasilnya
            return (0, contact_management_1.convertToContactResponseOutcome)(deleteRecord);
        });
    }
    static submitSearchContact(userPayload, inputContactSearchRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Melakukan validasi input
            validation_1.Validation.validate(contact_validation_1.ContactInputValidationRules.SEARCH_VALIDATION_RULES, inputContactSearchRequest);
            // Prepare filter conditions
            const filterConditions = [];
            // Check jika ada Nama yang dicari
            if (inputContactSearchRequest.name) {
                // Buat kondisi filter untuk mencari Nama
                const nameFilter = {
                    OR: [
                        { first_name: { contains: inputContactSearchRequest.name } },
                        { last_name: { contains: inputContactSearchRequest.name } }
                    ]
                };
                filterConditions.push(nameFilter); // Tambahkan kondisi filter ke dalam array
            }
            // Check jika ada Email yang dicari
            if (inputContactSearchRequest.email) {
                // Buat filter untuk mencari Email
                const emailFilter = {
                    email: { contains: inputContactSearchRequest.email }
                };
                filterConditions.push(emailFilter); // Tambahkan kondisi filter ke dalam array
            }
            // Check if ada Phone yang dicari
            if (inputContactSearchRequest.phone) {
                // Buat filter untuk mencari Email
                const phoneFilter = {
                    phone: { contains: inputContactSearchRequest.phone }
                };
                filterConditions.push(phoneFilter);
            }
            // Lakukan pencarian berdasarkan kondisi filter
            const searchByFiltering = yield database_1.prismaClient.contact.findMany({
                where: {
                    username: userPayload.username,
                    AND: filterConditions // Gabungkan kondisi filter dengan operator AND
                },
                skip: (inputContactSearchRequest.page - 1) * inputContactSearchRequest.size, // Hitung jumlah data yang akan diskip (paging)
                take: inputContactSearchRequest.size // Ambil jumlah data yang sesuai dengan ukuran page
            });
            // Hitung total jumlah data yang sesuai dengan kondisi filter
            const totalFilteredContacts = yield database_1.prismaClient.contact.count({
                where: {
                    username: userPayload.username,
                    AND: filterConditions // Gabungkan kondisi filter dengan operator AND
                }
                // Tidak gunakan Skip & Take, karena operasi ini hanya untuk menjumlahkan data record dari impact berdasarkan,
                // kondisi tertentu.
            });
            // Konversi data dan siapkan data paging
            return {
                data: searchByFiltering.map(data => (0, contact_management_1.convertToContactResponseOutcome)(data)),
                paging: {
                    size: inputContactSearchRequest.size, // Ukuran page
                    total_page: Math.ceil(totalFilteredContacts / inputContactSearchRequest.size), // Total page
                    current_page: inputContactSearchRequest.size // Page saat ini
                }
            };
        });
    }
}
exports.ContactService = ContactService;
