"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldDescription } from "@workspace/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { PasswordStrengthIndicator } from "./password-strength-indicator";
import { KIcon } from "@workspace/ui/components/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";

type InputControllerProps<TFieldValues extends FieldValues> = {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label?: string;
    description?: string;
    placeholder?: string;
    isLoading?: boolean;
    autoComplete?: string;
    showPasswordIndicator?: boolean;
    type?: string;
    Icon?: KIcon;
};

export function InputController<TFieldValues extends FieldValues>(
    props: InputControllerProps<TFieldValues>,
) {
    const [showPassword, setShowPassword] = useState(false);
    const {
        name,
        control,
        label,
        description,
        placeholder,
        isLoading,
        autoComplete,
        showPasswordIndicator,
        type,
        Icon,
    } = props;
    const t = useTranslations();

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : (type ?? "text");
    const toggleLabel = showPassword
        ? t("common.fields.passwordHide")
        : t("common.fields.passwordShow");

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1.5 group">
                    {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

                    <InputGroup className="bg-card py-6 px-0.5 rounded-2xl gap-1">
                        <InputGroupInput
                            {...field}
                            id={field.name}
                            type={inputType}
                            aria-invalid={fieldState.invalid}
                            placeholder={placeholder}
                            disabled={isLoading}
                            autoComplete={autoComplete ?? "new-password"}
                        />
                        {Icon && (
                            <InputGroupAddon>
                                <Icon className="size-5.5 text-muted-foreground group-data-[invalid=true]:text-destructive" />
                            </InputGroupAddon>
                        )}
                        {isPassword && (
                            <InputGroupAddon
                                align="inline-end"
                                className="text-sm cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {toggleLabel}
                            </InputGroupAddon>
                        )}
                    </InputGroup>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    {description && <FieldDescription>{description}</FieldDescription>}

                    {isPassword && showPasswordIndicator && (
                        <PasswordStrengthIndicator value={field.value} />
                    )}
                </Field>
            )}
        />
    );
}
