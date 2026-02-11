"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema, type RegisterUserInput, registerUser } from "@workspace/modules/users";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";

interface RegisterFormProps {
    onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterUserInput>({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            passwordConfirmation: "",
            locale: "en",
        },
    });

    const onSubmit = async (data: RegisterUserInput) => {
        setIsLoading(true);
        setError(null);

        try {
            await registerUser(data);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        placeholder="John"
                        {...register("firstName")}
                        disabled={isLoading}
                    />
                    {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        {...register("lastName")}
                        disabled={isLoading}
                    />
                    {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register("email")}
                    disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    {...register("phone")}
                    disabled={isLoading}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isLoading}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                    id="passwordConfirmation"
                    type="password"
                    placeholder="••••••••"
                    {...register("passwordConfirmation")}
                    disabled={isLoading}
                />
                {errors.passwordConfirmation && (
                    <p className="text-sm text-destructive">
                        {errors.passwordConfirmation.message}
                    </p>
                )}
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
            </Button>
        </form>
    );
}
