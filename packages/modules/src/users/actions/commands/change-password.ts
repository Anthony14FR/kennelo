import { api } from "@workspace/common";
import { ChangePasswordInput } from "../../validators/change-password.schema";

export async function changePassword(input: ChangePasswordInput): Promise<void> {
    const response = await api.put("/user/password", {
        current_password: input.currentPassword,
        password: input.password,
        password_confirmation: input.passwordConfirmation,
    });

    if (response.status !== 200) {
        throw new Error("Failed to change password");
    }
}
