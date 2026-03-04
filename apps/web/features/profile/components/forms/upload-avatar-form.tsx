"use client";

import { uploadAvatar } from "@workspace/modules/users";
import { ImageCropper } from "@workspace/ui/components/image-cropper";
import { useAsyncState } from "@/hooks/use-async-state";
import { useAuth } from "@/features/auth";

export function UploadAvatarForm() {
    const { user, refreshUser } = useAuth();
    const { isLoading, execute } = useAsyncState();

    const handleCrop = async (file: File) => {
        await execute(() => uploadAvatar(file), {
            onSuccess: () => refreshUser(),
        });
    };

    return (
        <ImageCropper
            src={user?.avatarUrl ?? undefined}
            fallback={user?.getInitials()}
            onCrop={handleCrop}
            isLoading={isLoading}
            circular
        />
    );
}
