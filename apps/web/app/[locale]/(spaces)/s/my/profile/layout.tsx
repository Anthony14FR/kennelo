"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
    { label: "Modifier mon profil", href: "/s/my/profile/about", commingSoon: false },
    { label: "Préférences e-mail", href: "/s/my/profile/preferences-email", commingSoon: true },
    {
        label: "Préférences notifications",
        href: "/s/my/profile/preferences-notification",
        commingSoon: true,
    },
    { label: "Changer de mot de passe", href: "/s/my/profile/change-password", commingSoon: false },
];

export default function ProfileSettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-card">
            {/* Header */}
            <div className="h-18 flex items-center">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <h1 className="text-3xl font-semibold tracking-tight">Paramètres</h1>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Search" />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="container mx-auto flex items-center justify-between">
                <div className="flex">
                    {/* Sidebar */}
                    <aside className="relative min-w-64 shrink-0 px-4 py-6">
                        <nav className="sticky top-24 flex flex-col gap-1">
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
                                            <Badge variant={"destructive"} className="ml-2">
                                                Soon
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator orientation="vertical" className="self-stretch" />

                    {/* Content */}
                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
