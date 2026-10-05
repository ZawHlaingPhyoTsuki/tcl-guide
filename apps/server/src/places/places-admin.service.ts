import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import type { CreatePlaceDto, ListPlacesQuery, UpdatePlaceDto } from "./places.schemas.js";
import { PlacesRepository } from "./places.repository.js";
import { UploadsService } from "../uploads/uploads.service.js";

@Injectable()
export class PlacesAdminService {
  constructor(
    private readonly placesRepository: PlacesRepository,
    private readonly uploads: UploadsService,
  ) {}

  async getSummary() {
    const summary = await this.placesRepository.getSummary();
    return {
      ...summary,
      hiddenPlaces: summary.allPlaces - summary.publishedPlaces,
    };
  }

  listPlaces(query: ListPlacesQuery) {
    return this.placesRepository.listAdmin(query);
  }

  async createPlace(dto: CreatePlaceDto) {
    await this.assertCategoryExists(dto.categoryId);
    return this.placesRepository.create(dto);
  }

  async updatePlace(id: string, dto: UpdatePlaceDto) {
    await this.getPlace(id);
    if (dto.categoryId) await this.assertCategoryExists(dto.categoryId);
    return this.placesRepository.update(id, dto);
  }

  async removePlace(id: string) {
    const place = await this.getPlace(id);
    await this.placesRepository.delete(id);
    await this.uploads.deleteMany(place.photos);
  }

  private async getPlace(id: string) {
    const place = await this.placesRepository.findById(id);
    if (!place) throw new NotFoundException(`Place ${id} not found`);
    return place;
  }

  private async assertCategoryExists(categoryId: string) {
    const category = await this.placesRepository.categoryExists(categoryId);
    if (!category) throw new BadRequestException(`Category ${categoryId} does not exist`);
  }
}
