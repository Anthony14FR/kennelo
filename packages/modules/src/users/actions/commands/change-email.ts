import { api } from "@workspace/common";
import { ChangeEmailInput } from "../../validators/change-email.schema";

export async function changeEmail(input: ChangeEmailInput): Promise<void> {
    const response = await api.put("/user/email", {
        email: input.email,
        password: input.password,
    });

    if (response.status !== 200) {
        throw new Error("Failed to change email");
    }
}
