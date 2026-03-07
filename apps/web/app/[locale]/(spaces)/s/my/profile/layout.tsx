"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { routes } from "@/lib/routes";

export default function ProfileSettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const t = useTranslations();

    const settingsNav = [
        { label: t("ui.navigation.editProfile"), href: "/s/my/profile/about", commingSoon: false },
        {
            label: t("ui.navigation.emailPreferences"),
            href: routes.MyProfileEmailPreferences(),
            commingSoon: true,
        },
        {
            label: t("ui.navigation.notificationPreferences"),
            href: routes.MyProfilePreferencesNotification(),
            commingSoon: true,
        },
        {
            label: t("ui.navigation.changePassword"),
            href: routes.MyProfileChangePassword(),
            commingSoon: false,
        },
    ];

    return (
        <div className="min-h-screen bg-card">
            {/* Header */}
            <div className="h-18 flex items-center bg-background">
                <div className="container mx-auto flex items-center justify-between px-5">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {t("ui.navigation.profileSettings")}
                    </h1>
                    <div className="relative w-64">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input className="ps-9" placeholder={t("common.placeholders.search")} />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="container mx-auto flex items-center justify-between">
                <div className="flex">
                    <aside className="relative min-w-64 shrink-0 px-4 py-6">
                        <nav className="sticky top-22 flex flex-col gap-1">
                            {settingsNav.map((item) => {
                                const isActive = pathname.includes(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "rounded-lg px-3 py-2 text-sm transition-colors",
                                            isActive
                                                ? "bg-muted text-foreground font-medium"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                        )}
                                    >
                                        {item.label}
                                        {item.commingSoon && (
                                            <Badge variant={"destructive"} className="ms-2">
                                                {t("ui.navigation.comingSoon")}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator orientation="vertical" className="self-stretch" />

                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
