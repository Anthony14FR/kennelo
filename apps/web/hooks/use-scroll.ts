import { useCallback } from "react";

export function useScroll() {
    const scrollTo = useCallback((options = {}) => {
        window.scrollTo({ behavior: "smooth", ...options });
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const lock = useCallback(() => {
        document.body.style.overflow = "hidden";
    }, []);

    const unlock = useCallback(() => {
        document.body.style.overflow = "";
    }, []);

    return { scrollTo, scrollToTop, lock, unlock };
}
