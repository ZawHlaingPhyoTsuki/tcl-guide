import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CategoriesAdminService } from "./categories-admin.service.js";
import type { CategoriesRepository } from "./categories.repository.js";

function category(overrides: Record<string, unknown> = {}) {
  return {
    id: "cat1",
    slug: "cafe",
    nameMy: "ကော်ဖီဆိုင်",
    nameEn: "Cafe",
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
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  return {
    repository,
    service: new CategoriesAdminService(repository as unknown as CategoriesRepository),
  };
}

describe("CategoriesAdminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps the place count onto each category", async () => {
    const { repository, service } = makeService();
    repository.list.mockResolvedValue([category({ _count: { places: 3 } })]);

    await expect(service.list()).resolves.toEqual([
      expect.objectContaining({ slug: "cafe", placeCount: 3 }),
    ]);
  });

  it("rejects a duplicate slug with a conflict", async () => {
    const { repository, service } = makeService();
    repository.findBySlug.mockResolvedValue(category());

    await expect(service.create({ slug: "cafe", nameMy: "x" })).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("rejects deleting a category that still has places", async () => {
    const { repository, service } = makeService();
    repository.findById.mockResolvedValue(category({ _count: { places: 2 } }));

    await expect(service.remove("cat1")).rejects.toThrow(BadRequestException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it("deletes an empty category", async () => {
    const { repository, service } = makeService();
    repository.findById.mockResolvedValue(category());

    await expect(service.remove("cat1")).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith("cat1");
  });

  it("turns an unknown category into a not-found error", async () => {
    const { repository, service } = makeService();
    repository.findById.mockResolvedValue(null);

    await expect(service.update("missing", { nameMy: "x" })).rejects.toThrow(NotFoundException);
  });
});
