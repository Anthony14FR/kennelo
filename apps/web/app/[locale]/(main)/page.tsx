"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { routes } from "@/lib/routes";
import { Loaded } from "@workspace/ui/components/loaded";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="p-22 pt-2">
            <div className="h-[60vh] w-full bg-secondary rounded-4xl flex items-center justify-center p-4">
                {isAuthenticated ? <HomeAuthenticated /> : <HomeGuest />}
            </div>
        </div>
    );
}

function HomeGuest() {
    const t = useTranslations();
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{t("features.auth.welcome")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t("features.auth.description")}</p>
                <div className="flex gap-2">
                    <Button asChild className="flex-1">
                        <Link href={routes.Login()}>{t("features.auth.login.title")}</Link>
                    </Button>
                    <Button asChild variant="secondary" className="flex-1">
                        <Link href={routes.Register()}>{t("features.auth.register.title")}</Link>
                    </Button>
                    <LanguageSwitcher showDetails variant="outline" />
                </div>
            </CardContent>
        </Card>
    );
}

function UserInfoGrid({
    user,
    isLoaded,
}: {
    user: ReturnType<typeof useAuth>["user"];
    isLoaded: boolean;
}) {
    const t = useTranslations();
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    {t("common.fields.email")}
                </p>
                <div className="text-sm">
                    <Loaded isLoaded={isLoaded} className="w-48">
                        {user?.email}
                    </Loaded>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    {t("common.fields.phone")}
                </p>
                <div className="text-sm">
                    <Loaded isLoaded={isLoaded} className="w-48">
                        {user?.phone || "Not provided"}
                    </Loaded>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    {t("common.fields.locale")}
                </p>
                <div className="text-sm">
                    <Loaded isLoaded={isLoaded} className="w-12">
                        {user?.locale}
                    </Loaded>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Email Verified</p>
                <div className="text-sm">
                    <Loaded isLoaded={isLoaded} className="w-24">
                        {user?.isEmailVerified() ? "Yes" : "No"}
                    </Loaded>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">ID Verified</p>
                <div className="text-sm">
                    <Loaded isLoaded={isLoaded} className="w-10">
                        {user?.isIdVerified ? "Yes" : "No"}
                    </Loaded>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="text-sm capitalize">
                    <Loaded isLoaded={isLoaded} className="w-10">
                        {user?.status}
                    </Loaded>
                </div>
            </div>
        </div>
    );
}

function HomeAuthenticated() {
    const { user, isLoaded, logout } = useAuth();
    const t = useTranslations();
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>
                    <Loaded isLoaded={isLoaded} className="w-48 h-5">
                        {t("features.auth.welcomeBack", { name: user?.getFullName() || "" })}
                    </Loaded>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <UserInfoGrid user={user} isLoaded={isLoaded} />
                <div className="pt-4 flex gap-2">
                    <Button onClick={logout} variant="outline">
                        {t("features.auth.logout")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
