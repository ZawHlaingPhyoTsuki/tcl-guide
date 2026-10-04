import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlacesAdminService } from "./places-admin.service.js";
import { PlacesPublicService } from "./places-public.service.js";
import { PlacesRepository } from "./places.repository.js";

const { db } = vi.hoisted(() => ({
  db: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    place: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../services.js", () => ({ db }));

describe("PlacesRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters public places to active records", () => {
    const repository = new PlacesRepository();
    repository.listPublic({});

    expect(db.place.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true }),
      }),
    );
  });

  it("lists admin places without the active filter", () => {
    const repository = new PlacesRepository();
    repository.listAdmin({ category: "bakery", area: "San Sai" });

    expect(db.place.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { slug: "bakery" },
          area: { contains: "San Sai", mode: "insensitive" },
        }),
      }),
    );
  });
});

describe("PlacesAdminService", () => {
  it("returns directory summary metrics", async () => {
    const places = {
      getSummary: vi.fn().mockResolvedValue({
        allPlaces: 5,
        publishedPlaces: 3,
        areasCovered: 2,
      }),
    } as Pick<PlacesRepository, "getSummary">;
    const service = new PlacesAdminService(places as PlacesRepository);

    await expect(service.getSummary()).resolves.toEqual({
      allPlaces: 5,
      publishedPlaces: 3,
      hiddenPlaces: 2,
      areasCovered: 2,
    });
  });
});

describe("PlacesPublicService", () => {
  it("turns a missing public place into a not-found error", async () => {
    const places = {
      findPublic: vi.fn().mockResolvedValue(null),
    } as Pick<PlacesRepository, "findPublic">;
    const service = new PlacesPublicService(places as PlacesRepository);

    await expect(service.getPlace("missing")).rejects.toThrow("Place missing not found");
  });
});
