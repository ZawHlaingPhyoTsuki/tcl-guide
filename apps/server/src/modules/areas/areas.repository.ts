import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service.js";
import type { CreateAreaDto, UpdateAreaDto } from "./areas.schemas.js";

const withPlaceCount = { _count: { select: { places: true } } } as const;

@Injectable()
export class AreasRepository {
  constructor(private readonly db: PrismaService) {}

  list() {
    return this.db.area.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameMy: "asc" }],
      include: withPlaceCount,
    });
  }

  findById(id: string) {
    return this.db.area.findUnique({ where: { id }, include: withPlaceCount });
  }

  findBySlug(slug: string) {
    return this.db.area.findUnique({ where: { slug } });
  }

  async maxSortOrder(): Promise<number> {
    const result = await this.db.area.aggregate({ _max: { sortOrder: true } });
    return result._max.sortOrder ?? 0;
  }

  create(dto: CreateAreaDto) {
    return this.db.area.create({ data: dto, include: withPlaceCount });
  }

  update(id: string, dto: UpdateAreaDto) {
    return this.db.area.update({ where: { id }, data: dto, include: withPlaceCount });
  }

  delete(id: string) {
    return this.db.area.delete({ where: { id } });
  }
}
