import { z } from "zod";

export const changeEmailSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters"),
    password: z.string().min(1, "Password is required"),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
