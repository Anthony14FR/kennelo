import { Preferences } from "@capacitor/preferences";
import type { IStorageService } from "@workspace/common";

export class CapacitorStorageService implements IStorageService {
    async get(key: string): Promise<string | null> {
        const { value } = await Preferences.get({ key });
        return value;
    }

    async set(key: string, value: string): Promise<void> {
        await Preferences.set({ key, value });
    }

    async remove(key: string): Promise<void> {
        await Preferences.remove({ key });
    }

    async clear(): Promise<void> {
        await Preferences.clear();
    }
}
