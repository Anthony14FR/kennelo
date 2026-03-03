import { useSyncExternalStore } from "react";
import { getPlatform, isNative, isAndroid, isIos, isCapacitorApp, isBrowser } from "@/lib/platform";

interface PlatformInfo {
    platform: "web" | "android" | "ios" | "server";
    isNative: boolean;
    isAndroid: boolean;
    isIos: boolean;
    isCapacitorApp: boolean;
    isBrowser: boolean;
    isReady: boolean;
}

const getSnapshot = (): PlatformInfo => ({
    platform: getPlatform() as "web" | "android" | "ios" | "server",
    isNative: isNative(),
    isAndroid: isAndroid(),
    isIos: isIos(),
    isCapacitorApp: isCapacitorApp(),
    isBrowser: isBrowser(),
    isReady: true,
});

const getServerSnapshot = (): PlatformInfo => ({
    platform: "server",
    isNative: false,
    isAndroid: false,
    isIos: false,
    isCapacitorApp: false,
    isBrowser: false,
    isReady: false,
});

export function usePlatform(): PlatformInfo {
    return useSyncExternalStore(() => () => {}, getSnapshot, getServerSnapshot);
}
