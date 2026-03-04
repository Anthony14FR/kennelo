import { api } from "@workspace/common";
import { UserModel } from "../../models/user.model";
import { UserDto } from "../../models/dtos/user.dto";

export async function uploadAvatar(file: File): Promise<UserModel> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post<UserDto>("/user/avatar", formData);

    if (!response.data) {
        throw new Error("Failed to upload avatar");
    }

    return UserModel.from(response.data);
}
