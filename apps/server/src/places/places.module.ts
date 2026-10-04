import { Module } from "@nestjs/common";

import { CategoriesController, PlacesController } from "./places.controller.js";
import { PlacesService } from "./places.service.js";

@Module({
  controllers: [PlacesController, CategoriesController],
  providers: [PlacesService],
})
export class PlacesModule {}
