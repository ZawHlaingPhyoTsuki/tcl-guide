import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "./categories.schemas.js";

const withPlaceCount = { _count: { select: { places: true } } } as const;

@Injectable()
export class CategoriesRepository {
  constructor(private readonly db: PrismaService) {}

  list() {
    return this.db.category.findMany({
      orderBy: [{ nameEn: "asc" }, { nameMy: "asc" }],
      include: withPlaceCount,
    });
  }

  findById(id: string) {
    return this.db.category.findUnique({ where: { id }, include: withPlaceCount });
  }

  findBySlug(slug: string) {
    return this.db.category.findUnique({ where: { slug } });
  }

  create(dto: CreateCategoryDto) {
    return this.db.category.create({ data: dto, include: withPlaceCount });
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.db.category.update({ where: { id }, data: dto, include: withPlaceCount });
  }

  delete(id: string) {
    return this.db.category.delete({ where: { id } });
  }
}
