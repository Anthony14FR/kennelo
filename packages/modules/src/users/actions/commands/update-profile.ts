import { api } from "@workspace/common";
import { UserModel } from "../../models/user.model";
import { UserDto } from "../../models/dtos/user.dto";
import { UpdateProfileInput } from "../../validators/update-profile.schema";

export async function updateProfile(input: UpdateProfileInput): Promise<UserModel> {
    const response = await api.put<UserDto>("/user/profile", {
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone || null,
    });

    if (response.status !== 200) {
        throw new Error("Failed to update profile");
    }

    if (!response.data) {
        throw new Error("No data returned from update profile");
    }

    return UserModel.from(response.data);
}
