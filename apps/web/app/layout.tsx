import "@workspace/ui/globals.css";
import { Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Providers } from "@/components/providers";
import { Suspense } from "react";
import { DEFAULT_LOCALE, DEFAULT_LOCALE_DIR } from "@/dictionaries";
import { cn } from "@workspace/ui/lib/utils";

const fontSans = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang={DEFAULT_LOCALE} dir={DEFAULT_LOCALE_DIR} suppressHydrationWarning>
            <body
                className={cn(
                    fontSans.variable,
                    fontMono.variable,
                    "font-sans antialiased bg-background text-foreground",
                )}
            >
                <Providers>
                    <Suspense>{children}</Suspense>
                </Providers>
            </body>
        </html>
    );
}
