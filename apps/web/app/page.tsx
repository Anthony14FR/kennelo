"use client";

import { usePlatform } from "@/hooks/use-platform";
import { NativePage } from "./native-page";

export default function RootPage() {
    const { platform, isCapacitorApp, isReady } = usePlatform();

    if (!isReady)
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );

    if (isCapacitorApp) return <NativePage platform={platform} />;

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <p>Web Page</p>
            <span>Platform: {platform}</span>
        </div>
    );
}
