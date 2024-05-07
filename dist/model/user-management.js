"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUserResponseOutcome = void 0;
// Konversi user menjadi hasil operasi user
function convertToUserResponseOutcome(userPayload) {
    return { username: userPayload.username, name: userPayload.name };
}
exports.convertToUserResponseOutcome = convertToUserResponseOutcome;
