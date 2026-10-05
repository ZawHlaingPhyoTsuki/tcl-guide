import { getPlaces } from "../queries";
import { PlacesMap, PlacesMapSkeleton } from "./places-map";

export async function PlacesMapSection({ category, area }: { category?: string; area?: string }) {
  const places = await getPlaces({ category, area });
  return <PlacesMap places={places} />;
}

export { PlacesMapSkeleton };
