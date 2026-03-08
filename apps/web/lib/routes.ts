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

type MyPetsParams = {
    locale?: string | number;
};

type MyPetsDetailsParams = {
    locale?: string | number;
    id: string;
};

type MyProfileAboutParams = {
    locale?: string | number;
};

type MyProfileChangePasswordParams = {
    locale?: string | number;
};

type MyProfileEmailPreferencesParams = {
    locale?: string | number;
};

type MyProfilePreferencesNotificationParams = {
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

function MyPets(params?: MyPetsParams): string {
    return buildRoute("/[locale]/s/my/pets", params);
}

function MyPetsDetails(params: MyPetsDetailsParams): string {
    return buildRoute("/[locale]/s/my/pets/[id]", params);
}

function MyProfileAbout(params?: MyProfileAboutParams): string {
    return buildRoute("/[locale]/s/my/profile/about", params);
}

function MyProfileChangePassword(params?: MyProfileChangePasswordParams): string {
    return buildRoute("/[locale]/s/my/profile/change-password", params);
}

function MyProfileEmailPreferences(params?: MyProfileEmailPreferencesParams): string {
    return buildRoute("/[locale]/s/my/profile/preferences-email", params);
}

function MyProfilePreferencesNotification(params?: MyProfilePreferencesNotificationParams): string {
    return buildRoute("/[locale]/s/my/profile/preferences-notification", params);
}

export const routes = {
    RootPage,
    HostDetails,
    Home,
    Login,
    Register,
    MyPets,
    MyPetsDetails,
    MyProfileAbout,
    MyProfileChangePassword,
    MyProfileEmailPreferences,
    MyProfilePreferencesNotification,
} as const;

export type RouteName = keyof typeof routes;
