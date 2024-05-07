import { ZodType, z } from "zod";

export class ContactInputValidationRules {
     
     static readonly CREATE_VALIDATION_RULES: ZodType = z.object({
          first_name: z.string().min(5).max(100),
          last_name: z.string().min(5).max(100).optional(),
          email: z.string().email().endsWith(".com").optional(),
          phone: z.string().max(20).optional()
     });

     static readonly UPDATE_VALIDATION_RULES: ZodType = z.object({
          id: z.number().positive(),
          first_name: z.string().min(5).max(100),
          last_name: z.string().min(5).max(100).optional(),
          email: z.string().email().endsWith(".com").optional(),
          phone: z.string().max(20).optional()
     });

     static readonly SEARCH_VALIDATION_RULES: ZodType = z.object({
          name: z.string().min(1).optional(),
          phone: z.string().min(1).optional(),
          email: z.string().min(1).optional(),
          page: z.number().min(1).positive(),
          size: z.number().min(1).max(100).positive()
     });

}