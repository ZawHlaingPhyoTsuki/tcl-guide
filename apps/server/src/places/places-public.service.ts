import { Injectable, NotFoundException } from "@nestjs/common";

import type { ListPlacesQuery } from "./places.schemas.js";
import { PlacesRepository } from "./places.repository.js";

@Injectable()
export class PlacesPublicService {
  constructor(private readonly places: PlacesRepository) {}

  listCategories() {
    return this.places.listCategories();
  }

  listPlaces(query: ListPlacesQuery) {
    return this.places.listPublic(query);
  }

  async getPlace(id: string) {
    const place = await this.places.findPublic(id);
    if (!place) throw new NotFoundException(`Place ${id} not found`);
    return place;
  }
}
