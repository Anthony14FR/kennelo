// NOTE: This file is auto-generated
// Don't modify manually - your changes will be overwritten
// To regenerate it: pnpm --filter web generate:routes

import { buildRoute } from "./config/routes.config";

type HostDetailsParams = {
    locale?: string | number;
    uuid: string;
};

type LoginParams = {
    locale?: string | number;
};

type HomeParams = {
    locale?: string | number;
};

type RegisterParams = {
    locale?: string | number;
};

function HostDetails(params: HostDetailsParams): string {
    return buildRoute("/[locale]/host/[uuid]", params);
}

function Login(params?: LoginParams): string {
    return buildRoute("/[locale]/login", params);
}

function Home(params?: HomeParams): string {
    return buildRoute("/[locale]", params);
}

function Register(params?: RegisterParams): string {
    return buildRoute("/[locale]/register", params);
}

export const routes = {
    HostDetails,
    Login,
    Home,
    Register,
} as const;

export type RouteName = keyof typeof routes;
