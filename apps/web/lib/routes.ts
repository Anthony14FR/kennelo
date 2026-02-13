// NOTE: This file is auto-generated
// Don't modify manually - your changes will be overwritten
// To regenerate it: pnpm generate:routes

import { routesConfig } from './config/routes.config';

function buildRoute(path: string, params?: Record<string, string | number>): string {
  if (!params || Object.keys(params).length === 0) {
    return path;
  }

  const mode = routesConfig.mode;
  const preserved = routesConfig.preservedParams;
  const queryParams: Record<string, string> = {};
  let finalPath = path;

  Object.entries(params).forEach(([key, value]) => {
    if (mode === 'static' && !preserved.includes(key)) {
      queryParams[key] = String(value);
    } else {
      finalPath = finalPath.replace(`[${key}]`, String(value));
    }
  });

  const query = new URLSearchParams(queryParams).toString();
  return query ? `${finalPath}?${query}` : finalPath;
}

type HostDetailsParams = {
  locale: string | number;
  uuid: string;
};

type HostDetailsParamsOptionalLocale = Omit<HostDetailsParams, 'locale'> & { locale?: HostDetailsParams['locale'] };

function Login(): string {
  return '/login';
}

function Home(): string {
  return '/';
}

function Register(): string {
  return '/register';
}

function HostDetails(params: HostDetailsParams): string {
  return buildRoute('/[locale]/host/[uuid]', params);
}

function HostDetailsWithDefaultLocale(params: HostDetailsParamsOptionalLocale, defaultLocale: string): string {
  return HostDetails({ ...params, locale: params.locale || defaultLocale } as HostDetailsParams);
}

export const routes = {
  Login,
  Home,
  Register,
  HostDetails,
} as const;

export const routesWithDefaultLocale = {
  HostDetails: HostDetailsWithDefaultLocale,
} as const;

export type RouteName = keyof typeof routes;
