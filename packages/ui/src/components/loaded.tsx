import { Skeleton } from "@workspace/ui/components/skeleton";

interface LoadedProps {
    isLoaded: boolean;
    className?: string;
    children: React.ReactNode;
}

function Loaded({ isLoaded, className, children }: LoadedProps) {
    if (!isLoaded) return <Skeleton className={className} />;
    return <>{children}</>;
}

export { Loaded };
