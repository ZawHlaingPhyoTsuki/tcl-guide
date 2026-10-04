"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createPlace, updatePlace, type PlaceInput } from "../actions";
import type { Category, Place } from "../../types";

type FormValues = {
  nameMy: string;
  nameEn: string;
  descriptionMy: string;
  categoryId: string;
  area: string;
  addressText: string;
  phone: string;
  hoursText: string;
  priceRange: string;
  latitude: string;
  longitude: string;
  isActive: boolean;
};

function valuesFromPlace(place: Place | null, categoryId: string): FormValues {
  return {
    nameMy: place?.nameMy ?? "",
    nameEn: place?.nameEn ?? "",
    descriptionMy: place?.descriptionMy ?? "",
    categoryId: place?.categoryId ?? categoryId,
    area: place?.area ?? "",
    addressText: place?.addressText ?? "",
    phone: place?.phone ?? "",
    hoursText: place?.hoursText ?? "",
    priceRange: place?.priceRange ?? "",
    latitude: place?.latitude?.toString() ?? "",
    longitude: place?.longitude?.toString() ?? "",
    isActive: place?.isActive ?? true,
  };
}

function toOptional(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function AdminPlaceForm({
  categories,
  place,
  onSaved,
  onCancel,
}: {
  categories: Category[];
  place: Place | null;
  onSaved: (place: Place) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(() => valuesFromPlace(place, categories[0]?.id ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function setValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    const input: PlaceInput = {
      nameMy: values.nameMy.trim(),
      nameEn: toOptional(values.nameEn),
      descriptionMy: toOptional(values.descriptionMy),
      categoryId: values.categoryId,
      area: toOptional(values.area),
      addressText: toOptional(values.addressText),
      phone: toOptional(values.phone),
      hoursText: toOptional(values.hoursText),
      priceRange: toOptional(values.priceRange),
      latitude: values.latitude ? Number(values.latitude) : undefined,
      longitude: values.longitude ? Number(values.longitude) : undefined,
      isActive: values.isActive,
    };

    try {
      const saved = place ? await updatePlace(place.id, input) : await createPlace(input);
      onSaved(saved);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save place");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border-t pt-4" aria-label="Place form">
      <div className="grid gap-1">
        <Label htmlFor="nameMy">Name in Myanmar *</Label>
        <Input
          id="nameMy"
          required
          value={values.nameMy}
          onChange={(event) => setValue("nameMy", event.target.value)}
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="nameEn">English name</Label>
        <Input
          id="nameEn"
          value={values.nameEn}
          onChange={(event) => setValue("nameEn", event.target.value)}
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="categoryId">Category *</Label>
        <select
          id="categoryId"
          required
          value={values.categoryId}
          onChange={(event) => setValue("categoryId", event.target.value)}
          className="h-8 border border-input bg-background px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameMy}
              {category.nameEn ? ` · ${category.nameEn}` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-1">
        <Label htmlFor="descriptionMy">Description</Label>
        <Textarea
          id="descriptionMy"
          value={values.descriptionMy}
          onChange={(event) => setValue("descriptionMy", event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["area", "Area"],
            ["addressText", "Address"],
            ["phone", "Phone"],
            ["hoursText", "Hours"],
            ["priceRange", "Price range"],
            ["latitude", "Latitude"],
            ["longitude", "Longitude"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="grid gap-1">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type={key === "latitude" || key === "longitude" ? "number" : "text"}
              step={key === "latitude" || key === "longitude" ? "any" : undefined}
              value={values[key]}
              onChange={(event) => setValue(key, event.target.value)}
            />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(event) => setValue("isActive", event.target.checked)}
        />
        Visible in public directory
      </label>
      {error ? (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSaving || !values.categoryId}>
          {isSaving ? "Saving..." : place ? "Save changes" : "Create place"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
