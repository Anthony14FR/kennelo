import type { PetImageDto } from "./dtos/pet-image.dto";

export class PetImageModel {
    private constructor(
        public readonly id: string,
        public readonly url: string,
        public readonly order: number,
        public readonly createdAt: string,
    ) {}

    static from(dto: PetImageDto): PetImageModel {
        return new PetImageModel(dto.id, dto.url, dto.order, dto.created_at);
    }
}
