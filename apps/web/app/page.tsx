import Link from "next/link";
import { routes } from "@/lib/routes";
import { Device } from "@capacitor/device";
import { Button } from "@workspace/ui/components/button";
import { isMobile } from "@/lib/platform";

export default async function RootPage() {
    if (isMobile()) {
        const lang = (await Device.getLanguageCode()).value;

        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p>Root Page, lang: {lang}</p>
                <Button asChild>
                    <Link
                        href={routes.HostDetails({ locale: lang, uuid: "My custom uuid ahaha !!" })}
                    >
                        Host details
                    </Link>
                </Button>

                <Button asChild>
                    <Link href={routes.Home({ locale: lang })}>Home</Link>
                </Button>

                <Button asChild>
                    <Link href={routes.Login({ locale: lang })}>Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <p>Loading...</p>
        </div>
    );
}
