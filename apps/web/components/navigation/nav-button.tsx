import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import type { ComponentProps } from "react";

type NavButtonProps = ComponentProps<typeof Button>;

export default function NavButton({
    children,
    variant = "default",
    className,
    ...props
}: NavButtonProps) {
    return (
        <Button variant={variant} className={cn("rounded-full py-5", className)} {...props}>
            {children}
        </Button>
    );
}
