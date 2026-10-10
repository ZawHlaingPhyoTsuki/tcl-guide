import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type { CreateAreaDto, UpdateAreaDto } from "./areas.schemas.js";
import { AreasRepository } from "./areas.repository.js";

type AreaWithCount = Awaited<ReturnType<AreasRepository["list"]>>[number];

type AdminArea = Omit<AreaWithCount, "_count"> & { placeCount: number };

function toAdminArea(area: AreaWithCount): AdminArea {
  const { _count, ...rest } = area;
  return { ...rest, placeCount: _count.places };
}

@Injectable()
export class AreasAdminService {
  constructor(private readonly areasRepository: AreasRepository) {}

  async list() {
    const areas = await this.areasRepository.list();
    return areas.map(toAdminArea);
  }

  async create(dto: CreateAreaDto) {
    if (await this.areasRepository.findBySlug(dto.slug)) {
      throw new ConflictException(`Area "${dto.slug}" already exists`);
    }
    // New areas append after the latest order instead of piling onto 0.
    const sortOrder = dto.sortOrder ?? (await this.areasRepository.maxSortOrder()) + 1;
    return toAdminArea(await this.areasRepository.create({ ...dto, sortOrder }));
  }

  async update(id: string, dto: UpdateAreaDto) {
    await this.getArea(id);
    return toAdminArea(await this.areasRepository.update(id, dto));
  }

  async remove(id: string) {
    const area = await this.getArea(id);
    const places = area._count.places;
    if (places > 0) {
      throw new BadRequestException(
        `Area "${area.slug}" still has ${places} places; move them to another area first`,
      );
    }
    await this.areasRepository.delete(id);
  }

  private async getArea(id: string) {
    const area = await this.areasRepository.findById(id);
    if (!area) throw new NotFoundException(`Area ${id} not found`);
    return area;
  }
}
