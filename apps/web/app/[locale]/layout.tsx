import { LocaleProvider } from "@/contexts/locale.context";

export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "de" }];
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        locale: string;
    };
}) {
    const locale = (await params).locale;

    return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
