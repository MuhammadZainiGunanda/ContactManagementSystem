"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToAddressResponseOutcome = void 0;
// Konveri data address menjadi hasil operasi address
function convertToAddressResponseOutcome(payload) {
    return {
        id: payload.id,
        country: payload.country,
        city: payload.city || undefined,
        province: payload.province || undefined,
        street: payload.street || undefined,
        postal_code: payload.postal_code || undefined
    };
}
exports.convertToAddressResponseOutcome = convertToAddressResponseOutcome;
