import HostDetailsPage from "./host-details.page";

export type Query = {
    uuid: string;
};

export function generateStaticParams(): Query[] {
    return [{ uuid: "[uuid]" }];
}

export default function HostDetails() {
    return <HostDetailsPage />;
}
