import type { DateRange } from "react-day-picker";

export type PetType = "dog" | "cat" | "bird" | "reptile";
export type PetCounts = Record<PetType, number>;
export type ActivePanel = "location" | "dates" | "pets" | null;

export type LocationSuggestion = {
    id: string;
    name: string;
    type: "city" | "region";
};

export type RecentSearch = {
    id: string;
    location: string;
    dateFrom: Date;
    dateTo: Date;
    petCount: number;
};

export type SearchBarState = {
    activePanel: ActivePanel;
    location: string;
    dateRange: DateRange | undefined;
    petCounts: PetCounts;
};
