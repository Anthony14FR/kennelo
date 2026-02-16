"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema, type RegisterUserInput, registerUser } from "@workspace/modules/users";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface RegisterFormProps {
    onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations();

    const { handleSubmit, control } = useForm<RegisterUserInput>({
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
            toast.error(error, {
                position: "top-center",
                classNames: {
                    icon: "text-red-400",
                    content: "text-red-400",
                    toast: "bg-red-900/80 backdrop-blur-sm border border-red-800",
                },
            });

            setError(err instanceof Error ? err.message : "An error occurred during registration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="firstName"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                {t("common.fields.firstName")}
                            </FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder={t("common.placeholders.firstName")}
                                disabled={isLoading}
                                autoComplete="given-name"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="lastName"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                {t("common.fields.lastName")}
                            </FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder={t("common.placeholders.lastName")}
                                disabled={isLoading}
                                autoComplete="family-name"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>

            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>{t("common.fields.email")}</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="email"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("common.placeholders.email")}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            {t("common.fields.phone")} ({t("common.fields.optional")})
                        </FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="tel"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("common.placeholders.phone")}
                            disabled={isLoading}
                            autoComplete="tel"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>{t("common.fields.password")}</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="password"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("common.placeholders.password")}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="passwordConfirmation"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            {t("common.fields.passwordConfirmation")}
                        </FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="password"
                            aria-invalid={fieldState.invalid}
                            placeholder={t("common.placeholders.password")}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                    ? t("features.auth.register.loading")
                    : t("features.auth.create-account")}
            </Button>
        </form>
    );
}
