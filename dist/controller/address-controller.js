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
exports.AddressController = void 0;
const address_service_1 = require("../service/address-service");
class AddressController {
    static createAddress(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Prepare payload untuk membuat address
                const requestPayload = Object.assign({ contact_id: Number(request.params.contactId) }, request.body);
                // Panggil layanan untuk membuat address, dan tunggu konfirmasi
                const submitCreateAddressConfirmation = yield address_service_1.AddressService.submitCreateAddress(request.user, requestPayload);
                // Jika berhasil, kirim respons 200 beserta data baru
                response.status(200).json({ success: true, message: "Address created successfully", data: submitCreateAddressConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static getAddress(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Prepare payload untuk mendapatkan address
                const requestPayload = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId)
                };
                // Panggil layanan untuk mendapatkan address, dan tunggu konfirmasi
                const submitGetAddressConfirmation = yield address_service_1.AddressService.submitGetAddress(request.user, requestPayload);
                // Kirim respons 200 bersama dengan hasil dari permintaan address
                response.status(200).json({ success: true, message: "Address retrieved successfully", data: submitGetAddressConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static updateAddress(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Prepare payload untuk update address
                const requestPayload = Object.assign({ id: Number(request.params.addressId), contact_id: Number(request.params.contactId) }, request.body);
                // Panggil layanan untuk update address, dan tunggu konfirmasi
                const submitUpdateAddressConfirmation = yield address_service_1.AddressService.submitUpdateAddress(request.user, requestPayload);
                // Kirim respons 200 bersama data baru yang telah di update
                response.status(200).json({ success: true, message: "Address updated successfully", data: submitUpdateAddressConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static removeAddress(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Prepare payload untuk remove address
                const requestPayload = {
                    id: Number(request.params.addressId),
                    contact_id: Number(request.params.contactId)
                };
                // Panggil layanan untuk prosess hapus address, dan nunggu konfirmasi
                const submitRemoveAddressConfimation = yield address_service_1.AddressService.submitRemoveAddress(request.user, requestPayload);
                // Kirim respons 200 sebagai tanda prosess berhasil
                response.status(200).json({ success: true, message: "Address removed successfully", data: "OK" });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
    static getAddressesByContact(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Mendapatkan ID kontak dari parameter permintaan
                const contactId = Number(request.params.contactId);
                // Panggil layanan untuk prosess mendapatkan daftar record, dan nunggu konfirmasi
                const submitAddressListConfirmation = yield address_service_1.AddressService.submitlistAddressesByContact(request.user, contactId);
                response.status(200).json({ success: true, message: "Addresses retrieved successfully", data: submitAddressListConfirmation });
            }
            catch (error) {
                next(error); // Lewatkan Error ke middleware berikutnya
            }
        });
    }
}
exports.AddressController = AddressController;
