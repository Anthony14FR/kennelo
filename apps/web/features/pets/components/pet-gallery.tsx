"use client";

import Image from "next/image";
import { Images, PawPrint } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PetModel } from "@workspace/modules/pets";
import { Lightbox } from "@/components/media/lightbox";
import { isIllustratedType } from "@/features/pets/lib/pet-illustrations";

type PetGalleryProps = {
    pet: PetModel;
};

export function PetGallery({ pet }: PetGalleryProps) {
    const t = useTranslations();
    const typeCode = pet.animalType?.code?.toLowerCase() ?? "";
    const allImages = [
        ...(pet.avatarUrl ? [pet.avatarUrl] : []),
        ...pet.images.map((img) => img.url),
    ];
    const totalCount = allImages.length;

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const goNext = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % totalCount : 0));
    const goPrev = () =>
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + totalCount) % totalCount : 0));

    if (totalCount === 0) {
        return (
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
                {isIllustratedType(typeCode) ? (
                    <Image
                        src={`/illustrations/pets/${typeCode}.svg`}
                        alt={pet.animalType?.name ?? ""}
                        fill
                        className="object-contain p-12"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PawPrint className="size-20 text-muted-foreground/15" />
                    </div>
                )}
            </div>
        );
    }

    if (totalCount === 1) {
        return (
            <>
                <div
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(0)}
                >
                    <Image src={allImages[0]!} alt={pet.name} fill className="object-cover" />
                </div>
                {lightboxIndex !== null && (
                    <Lightbox
                        images={allImages}
                        altPrefix={pet.name}
                        currentIndex={lightboxIndex}
                        onClose={closeLightbox}
                        onNext={goNext}
                        onPrev={goPrev}
                        onGoTo={setLightboxIndex}
                    />
                )}
            </>
        );
    }

    const [main, ...rest] = allImages;
    const displayThumbs = rest.slice(0, 2);

    return (
        <>
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                <div className="grid h-full" style={{ gridTemplateColumns: "3fr 2fr", gap: "3px" }}>
                    <div
                        className="relative overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(0)}
                    >
                        <Image src={main!} alt={pet.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col gap-[3px]">
                        {displayThumbs.map((url, i) => (
                            <div
                                key={url}
                                className="relative overflow-hidden flex-1 cursor-pointer"
                                onClick={() => openLightbox(i + 1)}
                            >
                                <Image src={url} alt={pet.name} fill className="object-cover" />
                            </div>
                        ))}
                        {displayThumbs.length < 2 && <div className="flex-1 bg-muted" />}
                    </div>
                </div>
                <button
                    className="absolute bottom-3 end-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-4xl border shadow-sm hover:bg-background transition-colors"
                    onClick={() => openLightbox(0)}
                >
                    <Images className="size-3.5" />
                    {t("features.pets.profile.viewPhotos", { count: totalCount })}
                </button>
            </div>

            {lightboxIndex !== null && (
                <Lightbox
                    images={allImages}
                    altPrefix={pet.name}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onNext={goNext}
                    onPrev={goPrev}
                    onGoTo={setLightboxIndex}
                />
            )}
        </>
    );
}
