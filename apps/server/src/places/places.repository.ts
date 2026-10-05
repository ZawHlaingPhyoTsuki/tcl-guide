import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import type { CreatePlaceDto, ListPlacesQuery, UpdatePlaceDto } from "./places.schemas.js";

@Injectable()
export class PlacesRepository {
  constructor(private readonly db: PrismaService) {}

  async listCategories() {
    return this.db.category.findMany({
      orderBy: { nameEn: "asc" },
      select: { id: true, slug: true, nameMy: true, nameEn: true },
    });
  }

  async listPublic(query: ListPlacesQuery) {
    return this.db.place.findMany({
      where: {
        isActive: true,
        category: query.category ? { slug: query.category } : undefined,
        area: query.area ? { contains: query.area, mode: "insensitive" } : undefined,
      },
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findPublic(id: string) {
    return this.db.place.findUnique({
      where: { id, isActive: true },
      include: { category: true },
    });
  }

  async listAdmin(query: ListPlacesQuery) {
    return this.db.place.findMany({
      where: {
        category: query.category ? { slug: query.category } : undefined,
        area: query.area ? { contains: query.area, mode: "insensitive" } : undefined,
      },
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getSummary() {
    const [allPlaces, publishedPlaces, areas] = await Promise.all([
      this.db.place.count(),
      this.db.place.count({ where: { isActive: true } }),
      this.db.place.findMany({
        where: { area: { not: null } },
        select: { area: true },
        distinct: ["area"],
      }),
    ]);

    return { allPlaces, publishedPlaces, areasCovered: areas.length };
  }

  findById(id: string) {
    return this.db.place.findUnique({ where: { id }, include: { category: true } });
  }

  categoryExists(categoryId: string) {
    return this.db.category.findUnique({ where: { id: categoryId } });
  }

  create(dto: CreatePlaceDto) {
    return this.db.place.create({ data: dto, include: { category: true } });
  }

  update(id: string, dto: UpdatePlaceDto) {
    return this.db.place.update({ where: { id }, data: dto, include: { category: true } });
  }

  delete(id: string) {
    return this.db.place.delete({ where: { id } });
  }
}
