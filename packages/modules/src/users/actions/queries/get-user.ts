import { api } from "@workspace/common";
import { UserModel } from "../../models/user.model";
import { UserDto } from "../../models/dtos/user.dto";

export async function getUser(id: number): Promise<UserModel | undefined> {
    const response = await api.get<UserDto>(`/users/${id}`);

    if (response.status !== 200) throw new Error(`Failed to fetch user with id ${id}`);

    if (response.data == null) return undefined;

    return UserModel.from(response.data);
}
