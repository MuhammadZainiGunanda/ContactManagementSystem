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
exports.AddressService = void 0;
const address_management_1 = require("../model/address-management");
const validation_1 = require("../validation/validation");
const addresss_validation_1 = require("../validation/addresss-validation");
const database_1 = require("../app/database");
const response_error_1 = require("../error/response-error");
class AddressService {
    static submitCreateAddress(userPayload, inputAddressCreateRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi input untuk pembuatan address
            validation_1.Validation.validate(addresss_validation_1.AddressInputValidation.CREATE_VALIDATION_RULES, inputAddressCreateRequest);
            // Cari kontak berdasarkan ID kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: inputAddressCreateRequest.contact_id }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Buat record address baru
            const createRecord = yield database_1.prismaClient.address.create({
                data: inputAddressCreateRequest
            });
            // Konversi data address dan return
            return (0, address_management_1.convertToAddressResponseOutcome)(createRecord);
        });
    }
    static submitGetAddress(userPayload, inputAddressGetRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi input untuk pengambilan address
            validation_1.Validation.validate(addresss_validation_1.AddressInputValidation.GET_VALIDATION_RULES, inputAddressGetRequest);
            // Cari kontak berdasarkan ID kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: inputAddressGetRequest.contact_id }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Cari address berdasarkan ID, dan ID kontak
            const checkAddressMustExist = yield database_1.prismaClient.address.findFirst({
                where: { id: inputAddressGetRequest.id, contact_id: inputAddressGetRequest.contact_id }
            });
            // Jika address tidak ditemukan, lempar kesalahan
            if (!checkAddressMustExist) {
                throw new response_error_1.ResponseError(404, "Address not found");
            }
            // Konversi data address dan return
            return (0, address_management_1.convertToAddressResponseOutcome)(checkAddressMustExist);
        });
    }
    static submitUpdateAddress(userPayload, inputAddressUpdateRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi input untuk update Address
            validation_1.Validation.validate(addresss_validation_1.AddressInputValidation.UPDATE_VALIDATION_RULES, inputAddressUpdateRequest);
            // Cari kontak berdasarkan ID kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: inputAddressUpdateRequest.contact_id }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Cari address berdasarkan ID, dan ID kontak
            const checkAddressMustExist = yield database_1.prismaClient.address.findFirst({
                where: { id: inputAddressUpdateRequest.id, contact_id: inputAddressUpdateRequest.contact_id }
            });
            // Jika address tidak ditemukan, lempar kesalahan
            if (!checkAddressMustExist) {
                throw new response_error_1.ResponseError(404, "Address not found");
            }
            // Update record Address
            const updateRecordAddress = yield database_1.prismaClient.address.update({
                where: { id: inputAddressUpdateRequest.id, contact_id: inputAddressUpdateRequest.contact_id },
                data: inputAddressUpdateRequest
            });
            // Konveri data Address dan return
            return (0, address_management_1.convertToAddressResponseOutcome)(updateRecordAddress);
        });
    }
    static submitRemoveAddress(userPayload, inputAddressRemoveRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi input untuk remove Address
            validation_1.Validation.validate(addresss_validation_1.AddressInputValidation.REMOVE_VALIDAtION_RULES, inputAddressRemoveRequest);
            // Cari kontak berdasarkan ID kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: inputAddressRemoveRequest.contact_id }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Cari address berdasarkan ID, dan ID kontak
            const checkAddressMustExist = yield database_1.prismaClient.address.findFirst({
                where: { id: inputAddressRemoveRequest.id, contact_id: inputAddressRemoveRequest.contact_id }
            });
            // Jika address tidak ditemukan, lempar kesalahan
            if (!checkAddressMustExist) {
                throw new response_error_1.ResponseError(404, "Address not found");
            }
            // Delete record address
            const deleteRecordAddress = yield database_1.prismaClient.address.delete({
                where: { id: inputAddressRemoveRequest.id, contact_id: inputAddressRemoveRequest.contact_id }
            });
            return (0, address_management_1.convertToAddressResponseOutcome)(deleteRecordAddress);
        });
    }
    static submitlistAddressesByContact(userPayload, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cari kontak berdasarkan ID kontak dan username dari User payload
            const checkContactMustExist = yield database_1.prismaClient.contact.findFirst({
                where: { username: userPayload.username, id: contactId }
            });
            // Jika kontak tidak ditemukan, lempar kesalahan
            if (!checkContactMustExist) {
                throw new response_error_1.ResponseError(404, "Contact not found");
            }
            // Temukan record address berdasarkan ID kontak
            const addressesByContactId = yield database_1.prismaClient.address.findMany({
                where: { contact_id: contactId }
            });
            // Konversi record address dan kembalikan
            return addressesByContactId.map(record => (0, address_management_1.convertToAddressResponseOutcome)(record));
        });
    }
}
exports.AddressService = AddressService;
