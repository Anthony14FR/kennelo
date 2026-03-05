import type { IStorageService } from "@workspace/common";

function getRootDomain(): string {
    if (typeof window === "undefined") return "";
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname.endsWith(".localhost")) return "localhost";
    const parts = hostname.split(".");
    return `.${parts.slice(-2).join(".")}`;
}

export class CookieStorageService implements IStorageService {
    constructor(
        private readonly options: { path?: string; sameSite?: string; secure?: boolean; domain?: string } = {},
    ) {}

    async get(key: string): Promise<string | null> {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`));
        return match ? decodeURIComponent(match[1]!) : null;
    }

    async set(key: string, value: string): Promise<void> {
        if (typeof document === "undefined") return;
        const { path = "/", sameSite = "Strict", secure = location.protocol === "https:" } = this.options;
        const domain = this.options.domain ?? getRootDomain();
        const domainAttr = domain ? `; Domain=${domain}` : "";
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=${path}${domainAttr}; SameSite=${sameSite}${secure ? "; Secure" : ""}`;
    }

    async remove(key: string): Promise<void> {
        if (typeof document === "undefined") return;
        const { path = "/" } = this.options;
        const domain = this.options.domain ?? getRootDomain();
        const domainAttr = domain ? `; Domain=${domain}` : "";
        document.cookie = `${encodeURIComponent(key)}=; path=${path}${domainAttr}; Max-Age=0`;
    }

    async clear(): Promise<void> {
        if (typeof document === "undefined") return;
        const keys = document.cookie.split(";").map((c) => decodeURIComponent(c.split("=")[0]!.trim()));
        await Promise.all(keys.map((key) => this.remove(key)));
    }
}
