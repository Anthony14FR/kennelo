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

function makeGoNext(totalCount: number, set: (fn: (prev: number | null) => number) => void) {
    return () => set((prev) => ((prev ?? 0) + 1) % totalCount);
}

function makeGoPrev(totalCount: number, set: (fn: (prev: number | null) => number) => void) {
    return () => set((prev) => ((prev ?? 0) - 1 + totalCount) % totalCount);
}

function buildAllImages(avatarUrl: string | null, images: { url: string }[]): string[] {
    const list = images.map((img) => img.url);
    if (avatarUrl) return [avatarUrl, ...list];
    return list;
}

function PetGalleryEmpty({ typeCode, altName }: { typeCode: string; altName: string }) {
    if (isIllustratedType(typeCode)) {
        return (
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
                <Image
                    src={`/illustrations/pets/${typeCode}.svg`}
                    alt={altName}
                    fill
                    className="object-contain p-12"
                />
            </div>
        );
    }
    return (
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
                <PawPrint className="size-20 text-muted-foreground/15" />
            </div>
        </div>
    );
}

type PetGalleryMultiProps = {
    petName: string;
    main: string;
    displayThumbs: string[];
    totalCount: number;
    onOpen: (index: number) => void;
    t: ReturnType<typeof useTranslations>;
};

function PetGalleryMulti({
    petName,
    main,
    displayThumbs,
    totalCount,
    onOpen,
    t,
}: PetGalleryMultiProps) {
    return (
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
            <div className="grid h-full" style={{ gridTemplateColumns: "3fr 2fr", gap: "3px" }}>
                <div className="relative overflow-hidden cursor-pointer" onClick={() => onOpen(0)}>
                    <Image src={main} alt={petName} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-[3px]">
                    {displayThumbs.map((url, i) => (
                        <div
                            key={url}
                            className="relative overflow-hidden flex-1 cursor-pointer"
                            onClick={() => onOpen(i + 1)}
                        >
                            <Image src={url} alt={petName} fill className="object-cover" />
                        </div>
                    ))}
                    {displayThumbs.length < 2 && <div className="flex-1 bg-muted" />}
                </div>
            </div>
            <button
                className="absolute bottom-3 end-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-4xl border shadow-sm hover:bg-background transition-colors"
                onClick={() => onOpen(0)}
            >
                <Images className="size-3.5" />
                {t("features.pets.profile.viewPhotos", { count: totalCount })}
            </button>
        </div>
    );
}

export function PetGallery({ pet }: PetGalleryProps) {
    const t = useTranslations();
    const typeCode = pet.animalType?.code?.toLowerCase() ?? "";
    const allImages = buildAllImages(pet.avatarUrl, pet.images);
    const totalCount = allImages.length;

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const goNext = makeGoNext(totalCount, setLightboxIndex);
    const goPrev = makeGoPrev(totalCount, setLightboxIndex);

    if (totalCount === 0) {
        return <PetGalleryEmpty typeCode={typeCode} altName={pet.animalType?.name ?? ""} />;
    }

    if (totalCount === 1) {
        return (
            <>
                <div
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => setLightboxIndex(0)}
                >
                    <Image src={allImages[0]!} alt={pet.name} fill className="object-cover" />
                </div>
                {lightboxIndex !== null && (
                    <Lightbox
                        images={allImages}
                        altPrefix={pet.name}
                        currentIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
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
            <PetGalleryMulti
                petName={pet.name}
                main={main!}
                displayThumbs={displayThumbs}
                totalCount={totalCount}
                onOpen={setLightboxIndex}
                t={t}
            />
            {lightboxIndex !== null && (
                <Lightbox
                    images={allImages}
                    altPrefix={pet.name}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNext={goNext}
                    onPrev={goPrev}
                    onGoTo={setLightboxIndex}
                />
            )}
        </>
    );
}
