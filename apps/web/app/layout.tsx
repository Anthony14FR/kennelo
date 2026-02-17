import "@workspace/ui/globals.css";
import { Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Providers } from "@/components/providers";
import { DirectionProvider } from "@workspace/ui/components/direction";
import { Suspense } from "react";
import { DEFAULT_LOCALE, DEFAULT_LOCALE_DIR } from "@/dictionaries";

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
                className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased bg-background text-foreground`}
            >
                <Providers>
                    <DirectionProvider direction={DEFAULT_LOCALE_DIR} dir={DEFAULT_LOCALE_DIR}>
                        <Suspense>{children}</Suspense>
                    </DirectionProvider>
                </Providers>
            </body>
        </html>
    );
}
