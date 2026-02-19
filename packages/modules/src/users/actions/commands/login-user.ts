import { api } from "@workspace/common";
import { AuthModel } from "../../models/auth.model";
import { AuthResponseDto } from "../../models/dtos/auth.dto";
import { LoginUserInput } from "../../validators/login-user.schema";

export async function loginUser(input: LoginUserInput): Promise<AuthModel> {
    const response = await api.post<AuthResponseDto>("/login", {
        email: input.email,
        password: input.password,
    });

    if (response.status !== 200) {
        throw new Error("Failed to login");
    }

    if (!response.data) {
        throw new Error("No data returned from login");
    }

    const authModel = AuthModel.from(response.data);

    localStorage.setItem("access_token", authModel.accessToken);
    localStorage.setItem("refresh_token", authModel.refreshToken);

    return authModel;
}
