"use client";

import { useNavigation } from "@/hooks/use-navigation";

// eslint-disable-next-line sonarjs/no-commented-code
/*
export async function generateMetadata({ params }: { params: { uuid: string } }) {
    const { uuid } = await params;
    const host = await getHost(uuid);

    return {
        title: host.title,
        description: host.description,
    };
}
*/

export type Query = {
    uuid: string;
};

export default function HostDetails() {
    const { params } = useNavigation<Query>();
    return <div>Host details: {params.uuid}</div>;
}
