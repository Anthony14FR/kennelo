"use client";

import { useNavigation } from "@/hooks/use-navigation";

export default function HostDetailsPage() {
    const { params } = useNavigation();
    return <div>Host details: {params.uuid}</div>;
}
