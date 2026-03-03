"use client";

import { cn } from "@workspace/ui/lib/utils";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@workspace/ui/components/input-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { KHome, KCompass, KMessage, KHeart } from "@workspace/ui/components/icons";
import type { KIcon } from "@workspace/ui/components/icons";
import { Search } from "lucide-react";
import NavButton from "@/components/navigation/nav-button";
import NavItem from "@/components/navigation/nav-item";
import UserMenu from "@/components/navigation/user-menu";
import Image from "next/image";
import { useAuth } from "@/features/auth";
import { useTranslations } from "next-intl";

interface NavigationItem {
    icon: KIcon;
    text: string;
    active: boolean;
    href: string;
    special?: boolean;
}

interface AppLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export default function AppLayout({ children, className }: AppLayoutProps) {
    const isMobile = useIsMobile();
    const { user, isAuthenticated, logout } = useAuth();
    const t = useTranslations();

    const navigationItems: NavigationItem[] = [
        {
            icon: KHome,
            text: t("ui.navigation.home"),
            active: true,
            href: "/",
        },
        {
            icon: KCompass,
            text: t("ui.navigation.explore"),
            active: false,
            href: "/explore",
        },
        {
            icon: KHeart,
            text: t("ui.navigation.pets"),
            active: false,
            href: "/my-pets",
        },
        {
            icon: KMessage,
            text: t("ui.navigation.messages"),
            active: false,
            href: "/messages",
        },
    ];

    return (
        <div className="bg-background h-full relative">
            <Image
                className="absolute top-0 left-0 w-168"
                src="/left-shape.svg"
                width={120}
                height={100}
                alt="Kennelo logo"
            />

            <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-20">
                <div className="hidden">{/* Chat box */}</div>
                <div className="h-fit w-fit">
                    <Image
                        className="w-14"
                        src="/face.svg"
                        width={120}
                        height={100}
                        alt="Keny Face"
                    />
                </div>
            </div>

            {!isMobile && (
                <header className="fixed top-0 left-0 w-full h-16 flex items-center z-20">
                    <div className="container mx-auto h-full flex justify-between items-center px-4">
                        <div className="flex justify-start items-center w-full max-w-xs">
                            <InputGroup className="rounded-full px-1.5 !py-5 w-full border border-primary/20 bg-white/30 backdrop-blur-sm">
                                <InputGroupInput
                                    placeholder={t("common.placeholders.search-for-a-pension")}
                                    className="px-2 placeholder:text-base"
                                />
                                <InputGroupAddon align="inline-end" className="p-0">
                                    <InputGroupButton
                                        size="icon-sm"
                                        className="rounded-full h-8 aspect-square"
                                        variant="default"
                                    >
                                        <Search size={18} />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div className="relative w-full h-full flex justify-center items-center font-semibold text-lg">
                            <Image
                                className="object-cover max-h-full h-1/2 w-auto"
                                src="/logo_type.svg"
                                height={120}
                                width={30}
                                alt="Kennelo logo"
                            />
                        </div>
                        <div className="flex justify-end items-center">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {navigationItems.map((item) => (
                                            <NavItem
                                                key={item.href}
                                                Icon={item.icon}
                                                iconSize={24}
                                                active={item.active}
                                                iconSecondaryOpacity={1}
                                                href={item.href}
                                                className="mt-1"
                                            >
                                                {item.text}
                                            </NavItem>
                                        ))}
                                        <UserMenu user={user ?? undefined} onLogout={logout} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-1">
                                    <NavButton variant="ghost">
                                        {t("common.actions.becomePro")}
                                    </NavButton>
                                    <NavButton>Réserver en ligne</NavButton>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            )}
            <main
                className={cn(
                    "container mx-auto relative h-full",
                    // isMobile ? "pb-16" : "mt-16",
                    className,
                )}
            >
                {children}
            </main>
            {isMobile && (
                <nav className="fixed bottom-0 w-full h-14 bg-background border-t border-primary/10 flex items-center z-10">
                    <div className="container mx-auto h-full flex justify-between items-center px-4 sm:px-6">
                        {navigationItems.map((item) => (
                            <NavItem
                                key={item.href}
                                Icon={item.icon}
                                iconSize={item.special ? 24 : 28}
                                active={item.active}
                                iconSecondaryOpacity={item.active ? 1 : undefined}
                                href={item.href}
                                className={cn(
                                    "mt-1 text-xs text-muted-foreground",
                                    item.special &&
                                        "mt-0 px-0 bg-primary text-primary-foreground rounded-full aspect-square h-10",
                                )}
                            >
                                {!item.special && item.text}
                            </NavItem>
                        ))}
                        {isAuthenticated && (
                            <div className="flex flex-col items-center gap-0.5">
                                <UserMenu user={user ?? undefined} onLogout={logout} />
                                <span className="text-xs text-muted-foreground">Profile</span>
                            </div>
                        )}
                    </div>
                </nav>
            )}
        </div>
    );
}
