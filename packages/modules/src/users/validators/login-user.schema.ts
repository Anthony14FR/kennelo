import { z } from "zod";

export const loginUserSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
