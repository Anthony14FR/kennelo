import { api } from "@workspace/common";

export async function changeLocale(locale: string): Promise<void> {
    const response = await api.put("/user/locale", { locale });

    if (response.status !== 200) {
        throw new Error("Failed to change locale");
    }
}
