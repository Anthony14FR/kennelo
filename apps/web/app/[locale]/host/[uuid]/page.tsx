"use client";

import { useNavigation } from "@/hooks/use-navigation";

export type Query = {
    uuid: string;
};

export default function HostDetails() {
    const { params } = useNavigation<Query>();
    return <div>Host details: {params.uuid}</div>;
}
