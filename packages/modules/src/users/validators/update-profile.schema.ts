import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().max(255, "First name must be less than 255 characters").optional(),
    lastName: z.string().max(255, "Last name must be less than 255 characters").optional(),
    phone: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
