import type { IStorageService } from "./storage.interface";

export class LocalStorageService implements IStorageService {
    async get(key: string): Promise<string | null> {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
    }

    async set(key: string, value: string): Promise<void> {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
    }

    async remove(key: string): Promise<void> {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    }

    async clear(): Promise<void> {
        if (typeof window === "undefined") return;
        localStorage.clear();
    }
}
