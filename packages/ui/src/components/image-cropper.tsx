"use client";

import { type SyntheticEvent, useCallback, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
import { CameraIcon, CropIcon, ImageIcon, Trash2Icon } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";

import "react-image-crop/dist/ReactCrop.css";

export interface ImageCropperProps {
    src?: string;
    fallback?: string;
    onCrop: (file: File) => void | Promise<void>;
    isLoading?: boolean;
    className?: string;
    aspect?: number;
    circular?: boolean;
    outputType?: "image/png" | "image/jpeg";
    accept?: string;
}

function buildCrop(width: number, height: number, aspect: number): Crop {
    return centerCrop(
        makeAspectCrop({ unit: "%", width: 80 }, aspect, width, height),
        width,
        height,
    );
}

function cropToDataUrl(image: HTMLImageElement, crop: PixelCrop, outputType: string): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.round(crop.width * scaleX);
    canvas.height = Math.round(crop.height * scaleY);

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
    );

    return canvas.toDataURL(outputType, 0.92);
}

function dataUrlToFile(dataUrl: string, filename: string, type: string): File {
    const [, data] = dataUrl.split(",");
    const bstr = atob(data ?? "");
    const u8arr = Uint8Array.from({ length: bstr.length }, (_, i) => bstr.charCodeAt(i));
    return new File([u8arr], filename, { type });
}

export function ImageCropper({
    src,
    fallback,
    onCrop,
    isLoading = false,
    className,
    aspect = 1,
    circular = false,
    outputType = "image/jpeg",
    accept = "image/jpeg,image/png,image/gif",
}: ImageCropperProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [preview, setPreview] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [croppedSrc, setCroppedSrc] = useState("");

    const displaySrc = croppedSrc || src;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
        setCrop(undefined);
        setCompletedCrop(undefined);
        setDialogOpen(true);
        e.target.value = "";
    };

    const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(buildCrop(width, height, aspect));
    };

    const handleCropComplete = useCallback((c: PixelCrop) => {
        if (c.width && c.height) setCompletedCrop(c);
    }, []);

    const handleConfirm = async () => {
        if (!imgRef.current || !completedCrop?.width || !completedCrop.height) return;
        const dataUrl = cropToDataUrl(imgRef.current, completedCrop, outputType);
        if (!dataUrl) return;
        const ext = outputType.split("/")[1] ?? "jpeg";
        const file = dataUrlToFile(dataUrl, `image.${ext}`, outputType);
        setIsSubmitting(true);
        try {
            await onCrop(file);
            setCroppedSrc(dataUrl);
            setDialogOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
        setCrop(undefined);
        setCompletedCrop(undefined);
        setDialogOpen(false);
    };

    return (
        <>
            <button
                type="button"
                aria-label="Change image"
                disabled={isLoading || isSubmitting}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "group relative shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    circular ? "rounded-full" : "rounded-md overflow-hidden",
                    className,
                )}
            >
                {circular ? (
                    <Avatar className="size-24">
                        <AvatarImage src={displaySrc} alt="Image" />
                        <AvatarFallback className="text-3xl">{fallback}</AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="relative size-32 bg-muted flex items-center justify-center rounded-md overflow-hidden">
                        {displaySrc ? (
                            <img src={displaySrc} alt="Image" className="size-full object-cover" />
                        ) : (
                            <ImageIcon className="size-8 text-muted-foreground" />
                        )}
                    </div>
                )}
                <span
                    className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
                        circular ? "rounded-full" : "rounded-md",
                    )}
                >
                    <CameraIcon className="size-6 text-white" />
                </span>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
                aria-hidden="true"
            />

            <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    if (!open) handleCancel();
                }}
            >
                <DialogContent className="gap-4 p-0 sm:max-w-lg">
                    <DialogTitle className="sr-only">Crop image</DialogTitle>
                    <DialogHeader className="px-6 pt-4">
                        <h2 className="text-lg font-semibold">Crop image</h2>
                    </DialogHeader>

                    <div className="flex items-center justify-center px-6">
                        {preview && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, pct) => setCrop(pct)}
                                onComplete={handleCropComplete}
                                aspect={aspect}
                                circularCrop={circular}
                                className="max-h-[60vh] w-full rounded-lg overflow-hidden"
                            >
                                <img
                                    ref={imgRef}
                                    src={preview}
                                    alt="Crop preview"
                                    className="max-h-[60vh] w-full object-contain"
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}
                    </div>

                    <DialogFooter className="gap-2 p-6 pt-0">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                <Trash2Icon />
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            size="sm"
                            type="button"
                            disabled={!completedCrop?.width || isSubmitting}
                            onClick={() => void handleConfirm()}
                        >
                            <CropIcon />
                            {isSubmitting ? "Saving…" : "Crop"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
