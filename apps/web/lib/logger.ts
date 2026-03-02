/* eslint-disable no-console */
export const logger = {
    error: (...args: unknown[]) => {
        if (process.env.NODE_ENV !== "production") {
            console.error(...args);
        }
        // Ajouter Sentry
    },
    warn: (...args: unknown[]) => {
        if (process.env.NODE_ENV !== "production") {
            console.warn(...args);
        }
    },
    info: (...args: unknown[]) => {
        if (process.env.NODE_ENV !== "production") {
            console.info(...args);
        }
    },
};
