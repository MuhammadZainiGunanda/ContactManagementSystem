"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressInputValidation = void 0;
const zod_1 = require("zod");
class AddressInputValidation {
}
exports.AddressInputValidation = AddressInputValidation;
AddressInputValidation.CREATE_VALIDATION_RULES = zod_1.z.object({
    contact_id: zod_1.z.number().positive(),
    country: zod_1.z.string().min(5).max(100),
    city: zod_1.z.string().min(5).max(100).optional(),
    province: zod_1.z.string().min(5).max(100).optional(),
    street: zod_1.z.string().min(5).max(100).optional(),
    postal_code: zod_1.z.string().min(5).max(100).optional()
});
AddressInputValidation.GET_VALIDATION_RULES = zod_1.z.object({
    id: zod_1.z.number().positive(),
    contact_id: zod_1.z.number().positive()
});
AddressInputValidation.UPDATE_VALIDATION_RULES = zod_1.z.object({
    id: zod_1.z.number().positive(),
    contact_id: zod_1.z.number().positive(),
    country: zod_1.z.string().min(5).max(100),
    city: zod_1.z.string().min(5).max(100).optional(),
    province: zod_1.z.string().min(5).max(100).optional(),
    street: zod_1.z.string().min(5).max(100),
    postal_code: zod_1.z.string().min(5).max(100).optional()
});
AddressInputValidation.REMOVE_VALIDAtION_RULES = zod_1.z.object({
    id: zod_1.z.number().positive(),
    contact_id: zod_1.z.number().positive()
});
