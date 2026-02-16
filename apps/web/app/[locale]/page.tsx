"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import Link from "next/link";
import { useNavigation } from "@/hooks/use-navigation";
import { useTranslations } from "next-intl";

export default function Home() {
    const { routes } = useNavigation();
    const { user, isAuthenticated, logout } = useAuth();
    const t = useTranslations();

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center min-h-svh">
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
                            <Button asChild variant="outline" className="flex-1">
                                <Link href={routes.Register()}>
                                    {t("features.auth.register.title")}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-svh p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>
                        {t("features.auth.welcomeBack", { name: user.getFullName() })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t("common.fields.email")}
                            </p>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t("common.fields.phone")}
                            </p>
                            <p className="text-sm">{user.phone || "Not provided"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t("common.fields.locale")}
                            </p>
                            <p className="text-sm">{user.locale}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Email Verified
                            </p>
                            <p className="text-sm">{user.isEmailVerified() ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">ID Verified</p>
                            <p className="text-sm">{user.isIdVerified ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <p className="text-sm capitalize">{user.status}</p>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-2">
                        <Button onClick={logout} variant="outline">
                            {t("features.auth.logout")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
