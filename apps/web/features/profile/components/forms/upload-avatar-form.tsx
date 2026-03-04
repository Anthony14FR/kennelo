"use client";

import { useRef } from "react";
import { uploadAvatar } from "@workspace/modules/users";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Camera } from "lucide-react";
import { useAsyncState } from "@/hooks/use-async-state";
import { useAuth } from "@/features/auth";

export function UploadAvatarForm() {
    const { user, refreshUser } = useAuth();
    const { isLoading, execute } = useAsyncState();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await execute(() => uploadAvatar(file), {
            onSuccess: () => refreshUser(),
        });

        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <button
            type="button"
            className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
        >
            <Avatar className="size-24">
                <AvatarImage src={user?.avatarUrl ?? undefined} alt="Profile photo" />
                <AvatarFallback className="text-3xl">{user?.getInitials()}</AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white" />
            </span>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleFileChange}
            />
        </button>
    );
}
