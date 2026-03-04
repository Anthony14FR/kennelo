import { z } from "zod";

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        passwordConfirmation: z.string().min(1, "Password confirmation is required"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
