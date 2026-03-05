"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export type AsyncState<T> = {
    data: T | undefined;
    isLoading: boolean;
    error: string | undefined;
};

export type AsyncStateOptions<T> = {
    setter?: (data: T) => void;
    onSuccess?: (data: T) => void;
    onFailure?: (error: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldError?: (field: any, error: { message: string }) => void;
    /** @default false */
    displayError?: boolean;
    defaultError?: string;
};

function resolveErrorMessage(err: unknown, defaultError?: string): string {
    return err instanceof Error ? err.message : (defaultError ?? "An error occurred");
}

function resolveFieldErrors(err: unknown): Record<string, string[]> | undefined {
    if (err && typeof err === "object" && "fieldErrors" in err) {
        const fieldErrors = (err as { fieldErrors?: unknown }).fieldErrors;
        if (fieldErrors && typeof fieldErrors === "object") {
            return fieldErrors as Record<string, string[]>;
        }
    }
    return undefined;
}

function handleAsyncSuccess<T>(result: T, options?: AsyncStateOptions<T>): void {
    if (result !== undefined) options?.setter?.(result);
    options?.onSuccess?.(result);
}

function handleAsyncError<T>(
    err: unknown,
    options: AsyncStateOptions<T> | undefined,
    setError: (message: string) => void,
): void {
    const message = resolveErrorMessage(err, options?.defaultError);
    const fieldErrors = resolveFieldErrors(err);
    const hasFieldErrors =
        fieldErrors && options?.setFieldError && Object.keys(fieldErrors).length > 0;

    if (hasFieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
            options.setFieldError!(field, { message: messages[0] ?? "" });
        });
    } else {
        setError(message);
    }

    options?.onFailure?.(message);

    if (options?.displayError !== false) {
        toast.error(message, {
            position: "bottom-right",
            classNames: {
                icon: "text-destructive",
                content: "text-destructive",
                toast: "border !border-destructive/30 !bg-destructive/10 backdrop-blur-sm",
            },
        });
    }
}

/**
 * Hook for managing async operation states (loading, error)
 *
 * @example
 * const { execute, isLoading, error } = useAsyncState();
 *
 * const fetchData = async (id: number) => {
 *   const result = await execute(() => exampleFetchDataFromApi(id));
 *   return result;
 * };
 */
export function useAsyncState() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const execute = useCallback(
        async <T>(
            callback: () => Promise<T>,
            options?: AsyncStateOptions<T>,
        ): Promise<T | undefined> => {
            setIsLoading(true);
            setError(undefined);

            if (options && options?.displayError === undefined) options.displayError = false;

            try {
                const result = await callback();
                handleAsyncSuccess(result, options);
                return result;
            } catch (err) {
                handleAsyncError(err, options, setError);
                return undefined;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(undefined);
    }, []);

    return { execute, isLoading, error, reset };
}
