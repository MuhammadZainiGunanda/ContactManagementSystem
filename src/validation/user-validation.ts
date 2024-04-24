import { ZodType, z } from "zod";

export class UserInputValidationRules {

     static readonly REGISTRATION_VALIDATION_RULES : ZodType = z.object({
          username: z.string().min(5).max(100),
          name: z.string().min(5).max(100),
          password: z.string().min(5).max(100).regex(/^[A-Za-z].*$/)
     });

     static readonly LOGIN_VALIDATION_RULES : ZodType = z.object({
          username: z.string().min(5).max(100),
          password: z.string().min(5).max(100).regex(/^[A-Za-z].*$/)
     });

     static readonly UPDATE_VALIDATION_RULES : ZodType = z.object({
          name: z.string().min(5).max(100).optional(),
          password: z.string().min(5).max(100).regex(/^[A-Za-z].*$/).optional()
     });

}