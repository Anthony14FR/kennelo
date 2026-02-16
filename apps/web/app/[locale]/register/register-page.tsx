"use client";

import Link from "next/link";
import { RegisterForm } from "@/features/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { useNavigation } from "@/hooks/use-navigation";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
    const { routes, router } = useNavigation();
    const t = useTranslations();

    const handleSuccess = () => {
        router.push(routes.Home());
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        {t("features.auth.create-account")}
                    </CardTitle>
                    <CardDescription>{t("features.auth.register.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm onSuccess={handleSuccess} />
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-muted-foreground text-center">
                        {t("features.auth.alreadyHaveAccount")}{" "}
                        <Link href={routes.Login()} className="text-primary hover:underline">
                            {t("features.auth.login.here")}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
