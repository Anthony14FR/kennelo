import { getTranslations } from "next-intl/server";
import PetDetailsPage from "./pet-details-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t("features.pets.title"),
        description: t("features.pets.description"),
    };
}

export default function PetDetails() {
    return <PetDetailsPage />;
}
