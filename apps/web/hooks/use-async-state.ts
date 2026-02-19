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
    /** @default true */
    displayError?: boolean;
    defaultError?: string;
};

function resolveErrorMessage(err: unknown, defaultError?: string): string {
    return err instanceof Error ? err.message : (defaultError ?? "An error occurred");
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

    setError(message);
    options?.onFailure?.(message);

    if (options?.displayError !== false) {
        toast.error(message, {
            position: "top-center",
            classNames: {
                icon: "text-red-400",
                content: "text-red-400",
                toast: "bg-red-900/80 backdrop-blur-sm border border-red-800",
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
