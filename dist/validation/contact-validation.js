"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactInputValidationRules = void 0;
const zod_1 = require("zod");
class ContactInputValidationRules {
}
exports.ContactInputValidationRules = ContactInputValidationRules;
ContactInputValidationRules.CREATE_VALIDATION_RULES = zod_1.z.object({
    first_name: zod_1.z.string().min(5).max(100),
    last_name: zod_1.z.string().min(5).max(100).optional(),
    email: zod_1.z.string().email().endsWith(".com").optional(),
    phone: zod_1.z.string().max(20).optional()
});
ContactInputValidationRules.UPDATE_VALIDATION_RULES = zod_1.z.object({
    id: zod_1.z.number().positive(),
    first_name: zod_1.z.string().min(5).max(100),
    last_name: zod_1.z.string().min(5).max(100).optional(),
    email: zod_1.z.string().email().endsWith(".com").optional(),
    phone: zod_1.z.string().max(20).optional()
});
ContactInputValidationRules.SEARCH_VALIDATION_RULES = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().min(1).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive()
});
