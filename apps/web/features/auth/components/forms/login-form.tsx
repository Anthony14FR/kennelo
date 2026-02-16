"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema, type LoginUserInput, loginUser } from "@workspace/modules/users";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field";
import { useTranslations } from "next-intl";

interface LoginFormProps {
    onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations();

    const { handleSubmit, control } = useForm<LoginUserInput>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (data: LoginUserInput) => {
        setIsLoading(true);
        setError(null);

        try {
            await loginUser(data);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            autoComplete="current-password"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                        />
                        <FieldLabel
                            htmlFor={field.name}
                            className="text-sm font-normal cursor-pointer"
                        >
                            {t("common.fields.rememberMe")}
                        </FieldLabel>
                    </div>
                )}
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("features.auth.login.loading") : t("features.auth.login.title")}
            </Button>
        </form>
    );
}
