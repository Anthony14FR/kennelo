// NOTE: This file is auto-generated
// Don't modify manually - your changes will be overwritten
// To regenerate it: pnpm --filter web generate:routes

import { buildRoute } from "./config/routes.config";

type HostDetailsParams = {
    locale?: string | number;
    uuid: string;
};

type HomeParams = {
    locale?: string | number;
};

type LoginParams = {
    locale?: string | number;
};

type RegisterParams = {
    locale?: string | number;
};

function RootPage(): string {
    return "/";
}

function HostDetails(params: HostDetailsParams): string {
    return buildRoute("/[locale]/host/[uuid]", params);
}

function Home(params?: HomeParams): string {
    return buildRoute("/[locale]", params);
}

function Login(params?: LoginParams): string {
    return buildRoute("/[locale]/s/accounts/login", params);
}

function Register(params?: RegisterParams): string {
    return buildRoute("/[locale]/s/accounts/register", params);
}

export const routes = {
    RootPage,
    HostDetails,
    Home,
    Login,
    Register,
} as const;

export type RouteName = keyof typeof routes;
