"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

type LightboxProps = {
    images: string[];
    altPrefix: string;
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    onGoTo: (index: number) => void;
};

export function Lightbox({
    images,
    altPrefix,
    currentIndex,
    onClose,
    onNext,
    onPrev,
    onGoTo,
}: LightboxProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose, onNext, onPrev]);

    const hasMultiple = images.length > 1;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
            onClick={onClose}
        >
            <button
                className="absolute top-4 end-4 size-10 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors flex items-center justify-center z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <X className="size-5 text-white" />
            </button>

            {hasMultiple && (
                <button
                    className="absolute start-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors flex items-center justify-center z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                >
                    <ChevronLeft className="size-6 text-white" />
                </button>
            )}

            <div
                className="relative w-full max-w-4xl px-20 flex flex-col items-center gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                        src={images[currentIndex]!}
                        alt={`${altPrefix} ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                    />
                </div>
                <p className="text-white/50 text-sm">
                    {altPrefix} — {currentIndex + 1} / {images.length}
                </p>
            </div>

            {hasMultiple && (
                <button
                    className="absolute end-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors flex items-center justify-center z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                >
                    <ChevronRight className="size-6 text-white" />
                </button>
            )}

            {hasMultiple && (
                <div
                    className="absolute bottom-6 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onGoTo(i)}
                            className={`rounded-full bg-white transition-all ${
                                i === currentIndex
                                    ? "w-6 h-2"
                                    : "size-2 opacity-40 hover:opacity-70"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
