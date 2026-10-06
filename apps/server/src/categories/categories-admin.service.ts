import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type { CreateCategoryDto, UpdateCategoryDto } from "./categories.schemas.js";
import { CategoriesRepository } from "./categories.repository.js";

type CategoryWithCount = Awaited<ReturnType<CategoriesRepository["list"]>>[number];

export type AdminCategory = Omit<CategoryWithCount, "_count"> & { placeCount: number };

function toAdminCategory(category: CategoryWithCount): AdminCategory {
  const { _count, ...rest } = category;
  return { ...rest, placeCount: _count.places };
}

@Injectable()
export class CategoriesAdminService {
  constructor(private readonly categories: CategoriesRepository) {}

  async list() {
    const categories = await this.categories.list();
    return categories.map(toAdminCategory);
  }

  async create(dto: CreateCategoryDto) {
    if (await this.categories.findBySlug(dto.slug)) {
      throw new ConflictException(`Category "${dto.slug}" already exists`);
    }
    return toAdminCategory(await this.categories.create(dto));
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.getCategory(id);
    return toAdminCategory(await this.categories.update(id, dto));
  }

  async remove(id: string) {
    const category = await this.getCategory(id);
    const places = category._count.places;
    if (places > 0) {
      throw new BadRequestException(
        `Category "${category.slug}" still has ${places} places; move them to another category first`,
      );
    }
    await this.categories.delete(id);
  }

  private async getCategory(id: string) {
    const category = await this.categories.findById(id);
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }
}
