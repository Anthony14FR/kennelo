"use client";

import { MailCheck, Phone, ShieldCheck, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import type { PetModel } from "@workspace/modules/pets";
import type { UserModel } from "@workspace/modules/users";

type PetProfileOwnerProps = {
    pet: PetModel;
    currentUser: UserModel | null;
    ageDisplay: string | null;
};

type QuickInfoItem = { label: string; value: string };

function buildQuickInfoItems(
    pet: PetModel,
    ageDisplay: string | null,
    translate: (key: string) => string,
): QuickInfoItem[] {
    const items: QuickInfoItem[] = [];
    if (pet.animalType)
        items.push({
            label: translate("features.pets.fields.animalType"),
            value: pet.animalType.name,
        });
    if (pet.breed) items.push({ label: translate("features.pets.fields.breed"), value: pet.breed });
    if (ageDisplay) items.push({ label: translate("features.pets.fields.age"), value: ageDisplay });
    if (pet.weight)
        items.push({ label: translate("features.pets.fields.weight"), value: `${pet.weight} kg` });
    if (pet.sex)
        items.push({
            label: translate("features.pets.fields.sex"),
            value: translate(`features.pets.sex.${pet.sex}`),
        });
    if (pet.birthDate)
        items.push({
            label: translate("features.pets.fields.birthDate"),
            value: new Date(pet.birthDate).toLocaleDateString(),
        });
    if (pet.adoptionDate)
        items.push({
            label: translate("features.pets.fields.adoptionDate"),
            value: new Date(pet.adoptionDate).toLocaleDateString(),
        });
    return items;
}

function OwnerCardContent({
    currentUser,
    memberSince,
}: {
    currentUser: UserModel;
    memberSince: string | null;
}) {
    const t = useTranslations();
    return (
        <>
            <div className="flex items-center gap-4">
                <Avatar className="size-14 shrink-0">
                    {currentUser.avatarUrl && (
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.getFullName()} />
                    )}
                    <AvatarFallback className="text-base font-semibold">
                        {currentUser.getInitials()}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="font-bold text-base leading-tight truncate">
                        {currentUser.getFullName()}
                    </p>
                    {memberSince && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Membre depuis {memberSince}
                        </p>
                    )}
                </div>
            </div>

            {(currentUser.isIdVerified || currentUser.isEmailVerified() || currentUser.phone) && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        {currentUser.isIdVerified && (
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                <ShieldCheck className="size-4 shrink-0" />
                                <span>{t("common.fields.idVerified")}</span>
                            </div>
                        )}
                        {currentUser.isEmailVerified() && (
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                <MailCheck className="size-4 shrink-0" />
                                <span>{t("common.fields.emailVerified")}</span>
                            </div>
                        )}
                        {currentUser.phone && (
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                                <Phone className="size-4 shrink-0" />
                                <span>{t("common.fields.phoneVerified")}</span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export function PetProfileOwner({ pet, currentUser, ageDisplay }: PetProfileOwnerProps) {
    const t = useTranslations();
    const isOwner = currentUser?.id === pet.userId;

    const memberSince =
        isOwner && currentUser
            ? new Date(currentUser.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
              })
            : null;

    const quickInfoItems = buildQuickInfoItems(pet, ageDisplay, t);

    return (
        <div className="space-y-4">
            <Card className="rounded-2xl overflow-hidden py-4 gap-4">
                <CardHeader>
                    <CardTitle className="text-base">{t("features.pets.profile.owner")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isOwner && currentUser ? (
                        <OwnerCardContent currentUser={currentUser} memberSince={memberSince} />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <User className="size-5 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t("features.pets.profile.owner")}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="rounded-2xl py-4 pb-2.5 gap-4">
                <CardHeader>
                    <CardTitle className="text-base">
                        {t("features.pets.profile.quickInfo")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                    {quickInfoItems.map((item, index, arr) => (
                        <div key={index}>
                            <div className="flex justify-between items-center py-2.5">
                                <span className="text-sm text-muted-foreground">{item.label}</span>
                                <span className="text-sm font-medium capitalize">{item.value}</span>
                            </div>
                            {index < arr.length - 1 && <Separator />}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
