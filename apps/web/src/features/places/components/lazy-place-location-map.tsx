"use client";

import { useEffect, useRef, useState } from "react";

import type { Place } from "../types/place";
import { PlaceLocationMap } from "./place-location-map";

export function LazyPlaceLocationMap({ place }: { place: Place }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={containerRef} className="min-h-56">
      {visible ? <PlaceLocationMap place={place} /> : null}
    </div>
  );
}
