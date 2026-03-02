export {};

interface CapacitorGlobal {
    getPlatform: () => "web" | "android" | "ios";
    isNativePlatform: () => boolean;
}

declare global {
    interface Window {
        Capacitor?: CapacitorGlobal;
    }
}
