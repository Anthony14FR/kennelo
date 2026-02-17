import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/lib/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleDirection } from "@/dictionaries";
import AppLayout from "@/components/layouts/app-layout";
import LocaleUpdater from "@/components/locale-updater";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    return {
        title: "Kennelo",
        description: t("app.description"),
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const t = await getTranslations({ locale });

    return (
        <>
            <LocaleUpdater locale={locale} direction={t("settings.dir") as LocaleDirection} />
            <NextIntlClientProvider locale={locale}>
                <AppLayout>{children}</AppLayout>
            </NextIntlClientProvider>
        </>
    );
}
