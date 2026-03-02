import { api } from "@workspace/common";
import { UserModel } from "../../models/user.model";
import { UserDto } from "../../models/dtos/user.dto";

export async function getCurrentUser(): Promise<UserModel | null> {
    const response = await api.get<UserDto>("/user");

    if (response.status !== 200) throw new Error("Failed to fetch current user");
    if (!response.data) return null;

    return UserModel.from(response.data);
}
