import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import type { CreatePlaceDto, ListPlacesQuery, UpdatePlaceDto } from "./places.schemas.js";
import { PlacesRepository } from "./places.repository.js";

@Injectable()
export class PlacesAdminService {
  constructor(private readonly places: PlacesRepository) {}

  async getSummary() {
    const summary = await this.places.getSummary();
    return {
      ...summary,
      hiddenPlaces: summary.allPlaces - summary.publishedPlaces,
    };
  }

  listPlaces(query: ListPlacesQuery) {
    return this.places.listAdmin(query);
  }

  async createPlace(dto: CreatePlaceDto) {
    await this.assertCategoryExists(dto.categoryId);
    return this.places.create(dto);
  }

  async updatePlace(id: string, dto: UpdatePlaceDto) {
    await this.getPlace(id);
    if (dto.categoryId) await this.assertCategoryExists(dto.categoryId);
    return this.places.update(id, dto);
  }

  async removePlace(id: string) {
    await this.getPlace(id);
    await this.places.delete(id);
  }

  private async getPlace(id: string) {
    const place = await this.places.findById(id);
    if (!place) throw new NotFoundException(`Place ${id} not found`);
    return place;
  }

  private async assertCategoryExists(categoryId: string) {
    const category = await this.places.categoryExists(categoryId);
    if (!category) throw new BadRequestException(`Category ${categoryId} does not exist`);
  }
}
