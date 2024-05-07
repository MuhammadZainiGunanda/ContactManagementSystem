"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInputValidationRules = void 0;
const zod_1 = require("zod");
class UserInputValidationRules {
}
exports.UserInputValidationRules = UserInputValidationRules;
UserInputValidationRules.REGISTRATION_VALIDATION_RULES = zod_1.z.object({
    username: zod_1.z.string().min(5).max(100),
    name: zod_1.z.string().min(5).max(100),
    password: zod_1.z.string().min(5).max(100).regex(/^[A-Za-z].*$/)
});
UserInputValidationRules.LOGIN_VALIDATION_RULES = zod_1.z.object({
    username: zod_1.z.string().min(5).max(100),
    password: zod_1.z.string().min(5).max(100).regex(/^[A-Za-z].*$/)
});
UserInputValidationRules.UPDATE_VALIDATION_RULES = zod_1.z.object({
    name: zod_1.z.string().min(5).max(100).optional(),
    password: zod_1.z.string().min(5).max(100).regex(/^[A-Za-z].*$/).optional()
});
