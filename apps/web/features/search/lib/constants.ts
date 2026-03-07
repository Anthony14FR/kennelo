import type { LocationSuggestion, PetType, RecentSearch } from "./types";

export const PET_TYPES: PetType[] = ["dog", "cat", "bird", "reptile"];

export const LOCATION_SUGGESTIONS: LocationSuggestion[] = [
    { id: "paris", name: "Paris, Île-de-France", type: "city" },
    { id: "lyon", name: "Lyon, Auvergne-Rhône-Alpes", type: "city" },
    { id: "marseille", name: "Marseille, Provence-Alpes-Côte d'Azur", type: "city" },
    { id: "bordeaux", name: "Bordeaux, Nouvelle-Aquitaine", type: "city" },
    { id: "toulouse", name: "Toulouse, Occitanie", type: "city" },
    { id: "nice", name: "Nice, Provence-Alpes-Côte d'Azur", type: "city" },
    { id: "nantes", name: "Nantes, Pays de la Loire", type: "city" },
    { id: "strasbourg", name: "Strasbourg, Grand Est", type: "city" },
    { id: "montpellier", name: "Montpellier, Occitanie", type: "city" },
    { id: "rennes", name: "Rennes, Bretagne", type: "city" },
    { id: "bretagne", name: "Bretagne", type: "region" },
    { id: "normandie", name: "Normandie", type: "region" },
    { id: "occitanie", name: "Occitanie", type: "region" },
];

export const RECENT_SEARCHES: RecentSearch[] = [
    {
        id: "recent-1",
        location: "Paris, Île-de-France",
        dateFrom: new Date(2026, 3, 10),
        dateTo: new Date(2026, 3, 15),
        petCount: 2,
    },
    {
        id: "recent-2",
        location: "Lyon, Auvergne-Rhône-Alpes",
        dateFrom: new Date(2026, 4, 1),
        dateTo: new Date(2026, 4, 7),
        petCount: 1,
    },
];
