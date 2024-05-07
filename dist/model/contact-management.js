"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToContactResponseOutcome = void 0;
// Konversi data kontak menjadi hasil operasi kontak
function convertToContactResponseOutcome(contactPayload) {
    return {
        id: contactPayload.id,
        first_name: contactPayload.first_name,
        last_name: contactPayload.last_name || undefined,
        email: contactPayload.email || undefined,
        phone: contactPayload.phone || undefined
    };
}
exports.convertToContactResponseOutcome = convertToContactResponseOutcome;
