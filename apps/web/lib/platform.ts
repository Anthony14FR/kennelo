export const getPlatform = () => {
    if (typeof window === "undefined") return "server";
    const cap = window.Capacitor;
    return cap?.getPlatform?.() ?? "web";
};

export const isNative = () => {
    if (typeof window === "undefined") return false;
    return window.Capacitor?.isNativePlatform?.() ?? false;
};

export const isAndroid = () => getPlatform() === "android";
export const isIos = () => getPlatform() === "ios";

export const isMobile = () => isAndroid() || isIos();
export const isWeb = () => getPlatform() === "web";
