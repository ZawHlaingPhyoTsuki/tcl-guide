import { getAdminPlaces } from "../../queries";
import { PlacesMap, PlacesMapSkeleton } from "../../components/places-map";

export async function AdminPlacesMapSection() {
  const places = await getAdminPlaces();

  return (
    <section className="grid gap-3">
      <div>
        <h2 className="text-lg font-semibold">Place locations</h2>
        <p className="text-sm text-muted-foreground">
          Review every saved Place location, including Places hidden from the public directory.
        </p>
      </div>
      <PlacesMap places={places} includeInactive />
    </section>
  );
}

export { PlacesMapSkeleton as AdminPlacesMapSkeleton };
