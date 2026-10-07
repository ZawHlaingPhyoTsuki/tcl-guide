-- Phase 1: Area model, Place slug, PriceLevel, priceNote rename, new contacts, tags.
-- Safe on databases that already have places: every new column is nullable or
-- defaulted, existing area strings are migrated to Area rows, slugs are
-- backfilled from nameEn (or place-<id> fallback) with collision suffixes,
-- and priceRange data is preserved via RENAME (not drop + add).

-- CreateEnum
CREATE TYPE "PriceLevel" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateTable
CREATE TABLE "area" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameMy" TEXT NOT NULL,
    "nameEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "area_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "area_slug_key" ON "area"("slug");

-- Keep existing price data: rename instead of drop + add.
ALTER TABLE "place" RENAME COLUMN "priceRange" TO "priceNote";

-- New columns. Nullable/defaulted so existing rows survive.
ALTER TABLE "place" ADD COLUMN "slug" TEXT;
ALTER TABLE "place" ADD COLUMN "areaId" TEXT;
ALTER TABLE "place" ADD COLUMN "priceLevel" "PriceLevel";
ALTER TABLE "place" ADD COLUMN "phoneSecondary" TEXT;
ALTER TABLE "place" ADD COLUMN "facebookUrl" TEXT;
ALTER TABLE "place" ADD COLUMN "telegramHandle" TEXT;
ALTER TABLE "place" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT '{}';

-- Backfill Area rows from distinct existing non-empty area strings
-- (trimmed, case-insensitive dedupe, slugified, collision-suffixed).
WITH distinct_areas AS (
    SELECT DISTINCT ON (lower(trim("area"))) trim("area") AS name
    FROM "place"
    WHERE "area" IS NOT NULL AND trim("area") <> ''
),
slugged AS (
    SELECT
        name,
        NULLIF(trim(both '-' FROM substring(regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g') FROM 1 FOR 60)), '') AS base
    FROM distinct_areas
),
ranked AS (
    SELECT
        name,
        COALESCE(base, 'area') AS base,
        ROW_NUMBER() OVER (PARTITION BY COALESCE(base, 'area') ORDER BY lower(name)) AS rn
    FROM slugged
)
INSERT INTO "area" ("id", "slug", "nameMy", "sortOrder", "createdAt", "updatedAt")
SELECT
    'area_' || md5(lower(name)),
    base || CASE WHEN rn > 1 THEN '-' || rn::text ELSE '' END,
    name,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM ranked;

-- Link each place to its Area row (case-insensitive on the trimmed string).
UPDATE "place" p SET "areaId" = a."id"
FROM "area" a
WHERE p."area" IS NOT NULL AND lower(trim(p."area")) = lower(a."nameMy");

-- Backfill slugs: slugified nameEn, else place-<first 6 id chars>,
-- with -2, -3 suffixes on collision.
WITH base AS (
    SELECT
        "id",
        COALESCE(
            NULLIF(trim(both '-' FROM substring(regexp_replace(lower("nameEn"), '[^a-z0-9]+', '-', 'g') FROM 1 FOR 60)), ''),
            'place-' || substring("id" FROM 1 FOR 6)
        ) AS base
    FROM "place"
),
ranked AS (
    SELECT "id", base, ROW_NUMBER() OVER (PARTITION BY base ORDER BY "id") AS rn
    FROM base
)
UPDATE "place" p SET "slug" = r.base || CASE WHEN r.rn > 1 THEN '-' || r.rn::text ELSE '' END
FROM ranked r
WHERE p."id" = r."id";

-- Drop the old free-text column now that every place is linked.
ALTER TABLE "place" DROP COLUMN "area";

-- Enforce slug presence + uniqueness after the backfill.
ALTER TABLE "place" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "place_slug_key" ON "place"("slug");

-- CreateIndex
CREATE INDEX "place_areaId_idx" ON "place"("areaId");

-- AddForeignKey
ALTER TABLE "place" ADD CONSTRAINT "place_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
