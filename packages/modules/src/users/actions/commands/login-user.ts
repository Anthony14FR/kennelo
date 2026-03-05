import { api } from "@workspace/common";
import { AuthModel } from "../../models/auth.model";
import { AuthResponseDto } from "../../models/dtos/auth.dto";
import { LoginUserInput } from "../../validators/login-user.schema";
import { authService } from "../../services/auth.service";

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

    await authService.setTokens(authModel.accessToken, authModel.refreshToken);

    return authModel;
}
