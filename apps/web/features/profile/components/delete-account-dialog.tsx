"use client";

import { destroyUser, logoutUser } from "@workspace/modules/users";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAsyncState } from "@/hooks/use-async-state";
import { authService } from "@workspace/modules/users";
import { routes } from "@/lib/routes";

export function DeleteAccountDialog() {
    const { isLoading, execute } = useAsyncState();
    const router = useRouter();
    const t = useTranslations();

    const handleDelete = async () => {
        await execute(() => destroyUser(), {
            onSuccess: async () => {
                try {
                    await logoutUser();
                } catch {
                    // ignore logout errors, account is already deleted
                } finally {
                    authService.clearTokens();
                    router.push(routes.Login());
                }
            },
        });
    };

    const deleteAccountKey = "features.auth.deleteAccount" as const;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isLoading}>
                    {t(deleteAccountKey)}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t(deleteAccountKey)}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("features.auth.deleteAccountConfirmation")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.actions.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => void handleDelete()}
                        disabled={isLoading}
                        className="!bg-destructive !text-destructive-foreground hover:!bg-destructive/90"
                    >
                        {t(deleteAccountKey)}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
