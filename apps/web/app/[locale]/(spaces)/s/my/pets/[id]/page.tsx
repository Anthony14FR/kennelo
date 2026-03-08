import { useNavigation } from "@/hooks/use-navigation";

export type Query = {
    id: string;
};

export default function MyPetsDetails() {
    const { id } = useNavigation<Query>().params;

    return <div>{id}</div>;
}
