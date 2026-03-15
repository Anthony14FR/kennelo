"use client";

import type { ReactNode } from "react";

type PetSectionHeaderProps = {
    icon: ReactNode;
    title: string;
    count?: number;
};

export function PetSectionHeader({ icon, title, count }: PetSectionHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <h3 className="font-semibold text-base flex-1">{title}</h3>
            {count !== undefined && (
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {count}
                </span>
            )}
        </div>
    );
}
