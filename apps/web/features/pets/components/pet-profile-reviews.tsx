"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import {
    MOCK_AVG_RATING,
    MOCK_RATING_DISTRIBUTION,
    MOCK_REVIEWS,
} from "@/features/pets/lib/mock-reviews";

function StarRating({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
    const sizeClass = size === "sm" ? "size-3.5" : "size-5";
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`${sizeClass} ${
                        i < Math.round(value)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/25"
                    }`}
                />
            ))}
        </div>
    );
}

export function PetProfileReviews() {
    const t = useTranslations();
    const maxCount = Math.max(...MOCK_RATING_DISTRIBUTION.map((d) => d.count), 1);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <h3 className="text-lg font-semibold">{t("features.pets.profile.reviews")}</h3>
            </div>

            <Card className="rounded-2xl">
                <CardContent className="p-5">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center shrink-0">
                            <span className="text-5xl font-bold leading-none">
                                {MOCK_AVG_RATING}
                            </span>
                            <StarRating value={MOCK_AVG_RATING} size="md" />
                            <span className="text-xs text-muted-foreground mt-1">
                                {MOCK_REVIEWS.length} avis
                            </span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            {MOCK_RATING_DISTRIBUTION.map(({ star, count }) => (
                                <div key={star} className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5 w-12 shrink-0">
                                        <span className="text-xs">{star}</span>
                                        <Star className="size-3 fill-amber-400 text-amber-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 rounded-full transition-all"
                                            style={{
                                                width: `${(count / maxCount) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground w-4 text-end shrink-0">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {MOCK_REVIEWS.map((review, index) => (
                    <div key={review.id}>
                        <div className="py-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-9 shrink-0">
                                        <AvatarFallback className="text-xs font-semibold">
                                            {review.authorInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{review.authorName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(review.date).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <StarRating value={review.rating} size="sm" />
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                        {index < MOCK_REVIEWS.length - 1 && <Separator />}
                    </div>
                ))}
            </div>
        </div>
    );
}
