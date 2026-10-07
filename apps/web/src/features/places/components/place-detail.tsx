import type { ReactNode } from "react";
import { Clock, MapPin, Navigation, Phone, type LucideIcon } from "lucide-react";
import type { Place } from "../types/place";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceGallery } from "./place-gallery";
import { PlaceLocationMap } from "./place-location-map";

function getDirectionsUrl(place: Place): string | null {
  if (place.latitude !== null && place.longitude !== null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
  }
  if (place.addressText) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.addressText)}`;
  }
  return null;
}

function Actions({ place, className = "" }: { place: Place; className?: string }) {
  const directionsUrl = getDirectionsUrl(place);
  const telHref = place.phone ? `tel:${place.phone.replace(/[^\d+]/g, "")}` : null;
  if (!directionsUrl && !telHref) return null;

  const base =
    "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium outline-offset-2 focus-visible:outline-2";

  return (
    <div className={`flex gap-2 ${className}`}>
      {directionsUrl ? (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-primary text-primary-foreground hover:bg-primary/90`}
        >
          <Navigation className="size-4" aria-hidden />
          Directions
        </a>
      ) : null}
      {telHref ? (
        <a href={telHref} className={`${base} border-border bg-background hover:bg-muted border`}>
          <Phone className="size-4" aria-hidden />
          Call
        </a>
      ) : null}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="text-muted-foreground mt-1.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        <dt className="sr-only">{label}</dt>
        <dd className="leading-relaxed whitespace-pre-line">{children}</dd>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="border-border text-foreground rounded-full border px-3 py-1 text-sm leading-normal">
      {children}
    </span>
  );
}

export function PlaceDetail({ place }: { place: Place }) {
  const hasMap = place.latitude !== null && place.longitude !== null;
  const hasInfo = place.addressText || place.hoursText || place.phone;

  return (
    <>
      <article className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
        <div className="lg:col-start-1 lg:row-start-1">
          <PlaceGallery photos={place.photos} name={place.nameMy} />
        </div>

        <header className="lg:col-start-1 lg:row-start-2">
          <h1 className="text-2xl leading-snug font-semibold sm:text-3xl sm:leading-snug">
            {place.nameMy}
          </h1>
          {place.nameEn ? (
            <p className="text-muted-foreground mt-1 text-base">{place.nameEn}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>{place.category.nameMy}</Chip>
            {place.area ? <Chip>{place.area}</Chip> : null}
            {place.priceRange ? <Chip>{place.priceRange}</Chip> : null}
          </div>
        </header>

        <section className="border-border rounded-2xl border p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Actions place={place} className="hidden lg:flex" />
          {hasInfo ? (
            <dl className="grid gap-4 lg:mt-5">
              {place.addressText ? (
                <InfoRow icon={MapPin} label="Address">
                  {place.addressText}
                </InfoRow>
              ) : null}
              {place.hoursText ? (
                <InfoRow icon={Clock} label="Opening hours">
                  {place.hoursText}
                </InfoRow>
              ) : null}
              {place.phone ? (
                <InfoRow icon={Phone} label="Phone">
                  <a
                    href={`tel:${place.phone.replace(/[^\d+]/g, "")}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {place.phone}
                  </a>
                </InfoRow>
              ) : null}
            </dl>
          ) : null}
        </section>

        {place.descriptionMy ? (
          <section className="lg:col-start-1 lg:row-start-3">
            <h2 className="sr-only">About</h2>
            <p className="max-w-prose text-base leading-loose whitespace-pre-line">
              {place.descriptionMy}
            </p>
          </section>
        ) : null}

        {hasMap ? (
          <section className="lg:col-start-2 lg:row-start-3">
            <h2 className="sr-only">Location</h2>
            <div className="border-border h-56 overflow-hidden rounded-2xl border">
              <PlaceLocationMap place={place} />
            </div>
          </section>
        ) : null}
      </article>

      {/* Mobile: the two actions people come here for stay within thumb reach. */}
      <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <Actions place={place} className="mx-auto max-w-3xl" />
      </div>
    </>
  );
}

export function PlaceDetailSkeleton() {
  return (
    <div
      className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_21rem]"
      aria-busy="true"
      aria-label="Loading place"
    >
      <div className="grid gap-6">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/9]" />
        <div className="grid gap-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="border-border grid gap-4 rounded-2xl border p-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}
