import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AreasAdminService } from "./areas-admin.service.js";
import type { AreasRepository } from "./areas.repository.js";

function area(overrides: Record<string, unknown> = {}) {
  return {
    id: "area1",
    slug: "san-sai",
    nameMy: "San Sai",
    nameEn: null,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { places: 0 },
    ...overrides,
  };
}

function makeService() {
  const repository = {
    list: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    maxSortOrder: vi.fn().mockResolvedValue(2),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  return {
    repository,
    service: new AreasAdminService(repository as unknown as AreasRepository),
  };
}

describe("AreasAdminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps the place count onto each area", async () => {
    const { repository, service } = makeService();
    repository.list.mockResolvedValue([area({ _count: { places: 3 } })]);

    await expect(service.list()).resolves.toEqual([
      expect.objectContaining({ slug: "san-sai", placeCount: 3 }),
    ]);
  });

  it("appends a new area after the latest order", async () => {
    const { repository, service } = makeService();
    repository.findBySlug.mockResolvedValue(null);
    repository.create.mockImplementation(async (dto: Record<string, unknown>) => area(dto));

    await service.create({ slug: "riverside", nameMy: "Riverside" });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "riverside", sortOrder: 3 }),
    );
  });

  it("respects an explicit sort order on create", async () => {
    const { repository, service } = makeService();
    repository.findBySlug.mockResolvedValue(null);
    repository.create.mockImplementation(async (dto: Record<string, unknown>) => area(dto));

    await service.create({ slug: "riverside", nameMy: "Riverside", sortOrder: 0 });

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ sortOrder: 0 }));
    expect(repository.maxSortOrder).not.toHaveBeenCalled();
  });

  it("rejects a duplicate slug with a conflict", async () => {
    const { repository, service } = makeService();
    repository.findBySlug.mockResolvedValue(area());

    await expect(service.create({ slug: "san-sai", nameMy: "x" })).rejects.toThrow(
      ConflictException,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("rejects deleting an area that still has places", async () => {
    const { repository, service } = makeService();
    repository.findById.mockResolvedValue(area({ _count: { places: 2 } }));

    await expect(service.remove("area1")).rejects.toThrow(BadRequestException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it("deletes an empty area", async () => {
    const { repository, service } = makeService();
    repository.findById.mockResolvedValue(area());

    await expect(service.remove("area1")).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith("area1");
  });

  it("updates the sort order when reordering", async () => {
    const { repository, service } = makeService();
    repository.findById.mockResolvedValue(area());
    repository.update.mockImplementation(async (_id: string, dto: Record<string, unknown>) =>
      area(dto),
    );

    await service.update("area1", { nameMy: "San Sai", sortOrder: 2 });

    expect(repository.update).toHaveBeenCalledWith("area1", {
      nameMy: "San Sai",
      sortOrder: 2,
    });
  });

  it("turns an unknown area into a not-found error", async () => {
    const { repository, service } = makeService();
    repository.findById.mockResolvedValue(null);

    await expect(service.update("missing", { nameMy: "x" })).rejects.toThrow(NotFoundException);
  });
});
