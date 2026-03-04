import AppLayout from "@/components/layouts/app-layout";

export default async function MainAppLayout({ children }: { children: React.ReactNode }) {
    return <AppLayout>{children}</AppLayout>;
}
