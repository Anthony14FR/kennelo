import { api } from "@workspace/common";
import { AuthModel } from "../../models/auth.model";
import { AuthResponseDto } from "../../models/dtos/auth.dto";
import { RegisterUserInput } from "../../validators/register-user.schema";

export async function registerUser(input: RegisterUserInput): Promise<AuthModel> {
    const response = await api.post<AuthResponseDto>("/register", {
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        // phone: input.phone,
        password: input.password,
        password_confirmation: input.passwordConfirmation,
        locale: input.locale,
    });

    if (response.status !== 201) {
        throw new Error("Failed to register");
    }

    if (!response.data) {
        throw new Error("No data returned from registration");
    }

    const authModel = AuthModel.from(response.data);

    localStorage.setItem("access_token", authModel.accessToken);
    localStorage.setItem("refresh_token", authModel.refreshToken);

    return authModel;
}
