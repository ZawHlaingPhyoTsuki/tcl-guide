// Starter directory content for Tachileik. Entries are representative and
// meant to be curated with on-the-ground knowledge; Myanmar strings in
// particular deserve a native-speaker review pass.
import "varlock/auto-load";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/client.js";
import { ENV } from "../src/env.server.js";
import { createPlaceSchema } from "../src/places/places.schemas.js";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: ENV.DATABASE_URL }),
});

type SeedCategory = { slug: string; nameMy: string; nameEn: string };

const categories: SeedCategory[] = [
  { slug: "restaurant", nameMy: "စားသောက်ဆိုင်", nameEn: "Restaurant" },
  { slug: "cafe", nameMy: "ကော်ဖီဆိုင်", nameEn: "Cafe" },
  { slug: "bakery", nameMy: "မုန့်ဆိုင်", nameEn: "Bakery" },
  { slug: "street_food", nameMy: "လမ်းဘေးအစားအစာ", nameEn: "Street Food" },
  { slug: "bar", nameMy: "ဘား", nameEn: "Bar" },
  { slug: "hotel", nameMy: "ဟိုတယ်", nameEn: "Hotel" },
  { slug: "shop", nameMy: "ဆိုင်", nameEn: "Shop" },
];

type SeedPlace = {
  nameMy: string;
  nameEn?: string;
  descriptionMy?: string;
  category: string;
  area?: string;
  addressText?: string;
  phone?: string;
  hoursText?: string;
  priceRange?: string;
  latitude?: number;
  longitude?: number;
};

const places: SeedPlace[] = [
  {
    nameMy: "တာချီလိတ် ညဈေး အစားအစာတန်း",
    nameEn: "Tachileik Night Market Food Stalls",
    descriptionMy: "ညဘက်ဖွင့်သော လမ်းဘေးအစားအစာများ",
    category: "street_food",
    area: "Night Market",
    hoursText: "Evenings",
    priceRange: "$",
    latitude: 20.4482,
    longitude: 99.8831,
  },
  {
    nameMy: "ရှမ်းခေါက်ဆွဲဆိုင်",
    nameEn: "Shan Noodle Shop",
    descriptionMy: "ရှမ်းခေါက်ဆွဲနှင့် ဒေသအစားအစာများ",
    category: "restaurant",
    area: "San Sai",
    hoursText: "7:00 - 20:00",
    priceRange: "$",
    latitude: 20.4448,
    longitude: 99.8796,
  },
  {
    nameMy: "နယ်စပ်ဂိတ် ကော်ဖီဆိုင်",
    nameEn: "Border Gate Cafe",
    category: "cafe",
    area: "Border Gate",
    hoursText: "8:00 - 21:00",
    priceRange: "$$",
    latitude: 20.4459,
    longitude: 99.8862,
  },
  {
    nameMy: "တာလုတ်ဈေး မုန့်ဆိုင်",
    nameEn: "Taloke Market Bakery",
    category: "bakery",
    area: "Taloke Market",
    hoursText: "6:30 - 18:00",
    priceRange: "$",
    latitude: 20.4504,
    longitude: 99.8787,
  },
  {
    nameMy: "မဲခေါင် မြစ်ကမ်း စားသောက်ဆိုင်",
    nameEn: "Mekong Riverside Restaurant",
    category: "restaurant",
    area: "Riverside",
    hoursText: "10:00 - 22:00",
    priceRange: "$$",
    latitude: 20.4417,
    longitude: 99.8759,
  },
  {
    nameMy: "ဆန်ဆိုင်း လက်ဖက်ရည်ဆိုင်",
    nameEn: "San Sai Teashop",
    descriptionMy: "မြန်မာ လက်ဖက်ရည်နှင့် မုန့်များ",
    category: "cafe",
    area: "San Sai",
    hoursText: "6:00 - 18:00",
    priceRange: "$",
    latitude: 20.4436,
    longitude: 99.8814,
  },
  {
    nameMy: "ဟိုတယ် စားသောက်ဆိုင်",
    nameEn: "Hotel Restaurant",
    category: "hotel",
    area: "Town Center",
    hoursText: "6:30 - 22:00",
    priceRange: "$$$",
    latitude: 20.4472,
    longitude: 99.8848,
  },
  {
    nameMy: "ည ဘား",
    nameEn: "Night Bar",
    category: "bar",
    area: "Town Center",
    hoursText: "18:00 - 23:00",
    priceRange: "$$",
    latitude: 20.4491,
    longitude: 99.8875,
  },
  {
    nameMy: "ဒေသထွက် ပစ္စည်းဆိုင်",
    nameEn: "Local Products Shop",
    category: "shop",
    area: "Taloke Market",
    hoursText: "8:00 - 19:00",
    priceRange: "$",
    latitude: 20.4512,
    longitude: 99.8819,
  },
  {
    nameMy: "ခေါက်ဆွဲကြော် ဆိုင်",
    nameEn: "Fried Noodle Stall",
    category: "street_food",
    area: "Night Market",
    hoursText: "Evenings",
    priceRange: "$",
    latitude: 20.4465,
    longitude: 99.8891,
  },
];

async function main() {
  const idsBySlug = new Map<string, string>();
  for (const category of categories) {
    const saved = await db.category.upsert({
      where: { slug: category.slug },
      update: { nameMy: category.nameMy, nameEn: category.nameEn },
      create: category,
    });
    idsBySlug.set(saved.slug, saved.id);
  }
  console.log(`categories: ${idsBySlug.size} upserted`);

  let created = 0;
  let skipped = 0;
  for (const place of places) {
    const { category: slug, ...rest } = place;
    const categoryId = idsBySlug.get(slug);
    if (!categoryId) {
      throw new Error(`unknown seed category: ${slug}`);
    }
    // Same validation as the write API: seeds can't smuggle invalid shapes.
    const data = createPlaceSchema.parse({ ...rest, categoryId, photos: [] });
    const existing = await db.place.findFirst({
      where: { nameMy: data.nameMy, categoryId },
    });
    if (existing) {
      if (existing.latitude === null || existing.longitude === null) {
        await db.place.update({
          where: { id: existing.id },
          data: { latitude: data.latitude, longitude: data.longitude },
        });
      }
      skipped += 1;
      continue;
    }
    await db.place.create({ data });
    created += 1;
  }
  console.log(`places: ${created} created, ${skipped} skipped`);

  const admin = await db.user.findUnique({ where: { email: ENV.ADMIN_EMAIL } });
  if (!admin) {
    throw new Error(
      `ADMIN_EMAIL ${ENV.ADMIN_EMAIL} has not signed up yet. Sign up first, then re-run the seed.`,
    );
  }
  await db.user.update({ where: { id: admin.id }, data: { role: "admin" } });
  console.log(`admin: ${ENV.ADMIN_EMAIL} promoted`);
}

await main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
