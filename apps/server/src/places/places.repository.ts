import { db } from "../services.js";
import type { CreatePlaceDto, ListPlacesQuery, UpdatePlaceDto } from "./places.schemas.js";

export class PlacesRepository {
  async listCategories() {
    return db.category.findMany({
      orderBy: { nameEn: "asc" },
      select: { id: true, slug: true, nameMy: true, nameEn: true },
    });
  }

  async listPublic(query: ListPlacesQuery) {
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

  async findPublic(id: string) {
    return db.place.findUnique({
      where: { id, isActive: true },
      include: { category: true },
    });
  }

  async listAdmin(query: ListPlacesQuery) {
    return db.place.findMany({
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
      db.place.count(),
      db.place.count({ where: { isActive: true } }),
      db.place.findMany({
        where: { area: { not: null } },
        select: { area: true },
        distinct: ["area"],
      }),
    ]);

    return { allPlaces, publishedPlaces, areasCovered: areas.length };
  }

  findById(id: string) {
    return db.place.findUnique({ where: { id }, include: { category: true } });
  }

  categoryExists(categoryId: string) {
    return db.category.findUnique({ where: { id: categoryId } });
  }

  create(dto: CreatePlaceDto) {
    return db.place.create({ data: dto, include: { category: true } });
  }

  update(id: string, dto: UpdatePlaceDto) {
    return db.place.update({ where: { id }, data: dto, include: { category: true } });
  }

  delete(id: string) {
    return db.place.delete({ where: { id } });
  }
}
