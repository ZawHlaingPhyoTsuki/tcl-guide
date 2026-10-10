import { Module } from "@nestjs/common";

import { PrismaModule } from "../../prisma/prisma.module.js";
import { AreasAdminController } from "./areas-admin.controller.js";
import { AreasAdminService } from "./areas-admin.service.js";
import { AreasRepository } from "./areas.repository.js";

@Module({
  imports: [PrismaModule],
  controllers: [AreasAdminController],
  providers: [AreasAdminService, AreasRepository],
})
export class AreasModule {}
