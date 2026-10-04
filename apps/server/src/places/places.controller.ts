import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

import { PlacesService } from "./places.service.js";
import {
  createPlaceSchema,
  listPlacesSchema,
  updatePlaceSchema,
  type CreatePlaceDto,
  type ListPlacesQuery,
  type UpdatePlaceDto,
} from "./places.schemas.js";

@Controller("places")
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @AllowAnonymous()
  list(@Query({ schema: listPlacesSchema }) query: ListPlacesQuery) {
    return this.placesService.listPlaces(query);
  }

  @Get(":id")
  @AllowAnonymous()
  get(@Param("id") id: string) {
    return this.placesService.getPlace(id);
  }

  @Post()
  @Roles(["admin"])
  create(@Body({ schema: createPlaceSchema }) dto: CreatePlaceDto) {
    return this.placesService.createPlace(dto);
  }

  @Patch(":id")
  @Roles(["admin"])
  update(@Param("id") id: string, @Body({ schema: updatePlaceSchema }) dto: UpdatePlaceDto) {
    return this.placesService.updatePlace(id, dto);
  }

  @Delete(":id")
  @Roles(["admin"])
  @HttpCode(200)
  async remove(@Param("id") id: string) {
    await this.placesService.removePlace(id);
    return { deleted: true };
  }
}

@Controller("categories")
export class CategoriesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @AllowAnonymous()
  list() {
    return this.placesService.listCategories();
  }
}
