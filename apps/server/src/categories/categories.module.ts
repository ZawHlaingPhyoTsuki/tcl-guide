import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module.js";
import { CategoriesAdminController } from "./categories-admin.controller.js";
import { CategoriesAdminService } from "./categories-admin.service.js";
import { CategoriesRepository } from "./categories.repository.js";

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesAdminController],
  providers: [CategoriesAdminService, CategoriesRepository],
})
export class CategoriesModule {}
