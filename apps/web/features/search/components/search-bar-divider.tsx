"use client";

import { cn } from "@workspace/ui/lib/utils";

type SearchBarDividerProps = {
    hidden: boolean;
};

export function SearchBarDivider({ hidden }: SearchBarDividerProps) {
    return (
        <div
            className={cn(
                "h-5 w-px shrink-0 transition-all duration-150",
                hidden ? "opacity-0" : "bg-secondary/30",
            )}
        />
    );
}
