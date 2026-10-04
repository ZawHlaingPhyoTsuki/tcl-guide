import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { db } from "../services.js";
import type { CreatePlaceDto, ListPlacesQuery, UpdatePlaceDto } from "./places.schemas.js";

@Injectable()
export class PlacesService {
  listCategories() {
    return db.category.findMany({
      orderBy: { nameEn: "asc" },
      select: { id: true, slug: true, nameMy: true, nameEn: true },
    });
  }

  listPlaces(query: ListPlacesQuery) {
    return db.place.findMany({
      where: {
        isActive: true,
        category: query.category ? { slug: query.category } : undefined,
        area: query.area ? { contains: query.area, mode: "insensitive" } : undefined,
      },
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getPlace(id: string) {
    const place = await db.place.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!place) {
      throw new NotFoundException(`Place ${id} not found`);
    }
    return place;
  }

  async createPlace(dto: CreatePlaceDto) {
    await this.assertCategoryExists(dto.categoryId);
    return db.place.create({
      data: dto,
      include: { category: true },
    });
  }

  async updatePlace(id: string, dto: UpdatePlaceDto) {
    await this.getPlace(id);
    if (dto.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
    }
    return db.place.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async removePlace(id: string) {
    await this.getPlace(id);
    await db.place.delete({ where: { id } });
  }

  private async assertCategoryExists(categoryId: string) {
    const category = await db.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new BadRequestException(`Category ${categoryId} does not exist`);
    }
  }
}
