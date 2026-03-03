export type RequestConfig = {
    url: string;
    method: string;
    options: RequestInit;
};

export type ApiResponse<T> = {
    status: number;
    data: T | null;
};

interface ApiError extends Error {
    status: number;
    data: unknown;
    response: Response;
}

class ApiClient {
    public readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    private _buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
        const url = new URL(this.baseUrl + path);

        if (params) {
            Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
        }

        return url.toString();
    }

    private async _handleResponse<T>(resp: Response): Promise<ApiResponse<T>> {
        const status = resp.status;
        let data: T | null = null;
        const text = await resp.text();

        if (text) {
            const parsed = JSON.parse(text);
            data = (
                parsed && typeof parsed === "object" && "data" in parsed ? parsed.data : parsed
            ) as T;
        }

        if (status >= 400) {
            const error = new Error(`HTTP Error ${status}`) as ApiError;
            error.status = status;
            error.data = data;
            error.response = resp;
            throw error;
        }

        return { status, data };
    }

    private async _fetchApi(
        url: string,
        method: string,
        options: RequestInit = {},
    ): Promise<Response> {
        const config: RequestConfig = { url, method, options };

        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(config.options.headers as Record<string, string>),
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        return await fetch(config.url, {
            ...config.options,
            method: config.method ?? "GET",
            headers,
            credentials: "include",
        });
    }

    private async _request<T>(
        path: string,
        method: string,
        options: RequestInit = {},
        params?: Record<string, string | number | boolean>,
    ): Promise<ApiResponse<T>> {
        const url = this._buildUrl(path, params);
        const response = await this._fetchApi(url, method, options);
        return await this._handleResponse<T>(response);
    }

    async get<T = unknown>(
        path: string,
        params?: Record<string, string | number | boolean>,
    ): Promise<ApiResponse<T>> {
        return this._request<T>(path, "GET", {}, params);
    }

    async post<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
        return this._request<T>(path, "POST", { body: JSON.stringify(body) });
    }

    async put<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
        return this._request<T>(path, "PUT", { body: JSON.stringify(body) });
    }

    async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
        return this._request<T>(path, "DELETE");
    }
}

export const api = new ApiClient();
