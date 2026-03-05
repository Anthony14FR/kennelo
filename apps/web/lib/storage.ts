import { IStorageService } from "@workspace/common";
import { isNative } from "./platform";
import { CapacitorStorageService } from "./storage/capacitor-storage.service";
import { CookieStorageService } from "./storage/cookie-storage.service";

export function getAppStorage(): IStorageService {
    if (isNative()) {
        return new CapacitorStorageService();
    }
    return new CookieStorageService();
}
