export type MockReview = {
    id: number;
    authorName: string;
    authorInitials: string;
    rating: number;
    date: string;
    comment: string;
};

export const MOCK_REVIEWS: MockReview[] = [
    {
        id: 1,
        authorName: "Sophie Martin",
        authorInitials: "SM",
        rating: 5,
        date: "2024-11-15",
        comment:
            "Un animal adorable et très bien éduqué. Aucun problème durant tout le séjour, il s'est parfaitement intégré chez nous. On le reprend avec grand plaisir !",
    },
    {
        id: 2,
        authorName: "Thomas Bernard",
        authorInitials: "TB",
        rating: 5,
        date: "2024-09-02",
        comment:
            "Très sociable avec nos autres animaux et nos enfants. Un vrai compagnon pour toute la famille.",
    },
    {
        id: 3,
        authorName: "Marie Dubois",
        authorInitials: "MD",
        rating: 4,
        date: "2024-06-20",
        comment:
            "Adorable mais un peu énergique au début. S'est très bien calmé dès le second jour. Bien mangé, bien dormi.",
    },
];

export const MOCK_AVG_RATING = Number(
    (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1),
);

export const MOCK_RATING_DISTRIBUTION = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: MOCK_REVIEWS.filter((r) => r.rating === star).length,
}));
