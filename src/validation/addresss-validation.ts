import { ZodType, z } from "zod";

export class AddressInputValidation {

     static readonly CREATE_VALIDATION_RULES: ZodType = z.object({
          contact_id: z.number().positive(),
          country: z.string().min(5).max(100),
          city: z.string().min(5).max(100).optional(),
          province: z.string().min(5).max(100).optional(),
          street: z.string().min(5).max(100).optional(),
          postal_code: z.string().min(5).max(100).optional()
     });

     static readonly GET_VALIDATION_RULES: ZodType = z.object({
          id: z.number().positive(),
          contact_id: z.number().positive()
     });

     static readonly UPDATE_VALIDATION_RULES: ZodType = z.object({
          id: z.number().positive(),
          contact_id: z.number().positive(),
          country: z.string().min(5).max(100),
          city: z.string().min(5).max(100).optional(),
          province: z.string().min(5).max(100).optional(),
          street: z.string().min(5).max(100),
          postal_code: z.string().min(5).max(100).optional()
     });

     static readonly REMOVE_VALIDAtION_RULES: ZodType = z.object({
          id: z.number().positive(),
          contact_id: z.number().positive()
     });

}