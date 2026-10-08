"use client";

import { useForm, useStore, type AnyFieldApi } from "@tanstack/react-form";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  Attachment,
  AttachmentActions,
  AttachmentAction,
  AttachmentMedia,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/form-text-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

import { createPlace, removeUpload, requestUpload, updatePlace } from "../../places-actions";
import { errorMessages, toOptional } from "@/lib/form";
import { cn } from "@/lib/utils";
import {
  formatPhotoShrinkHint,
  PLACE_TAG_LABELS,
  PLACE_TAGS,
  PRICE_LEVEL_LABELS,
} from "../../places-constants";
import { prepareImageForUpload } from "../../places-image";
import { slugifyPlaceName } from "../../places-slug";

import { placeFormSchema, type PlaceFormValues, type PlaceInput } from "../../places-schema";
import type { Category } from "@/features/categories/types/category";
import type { Area } from "@/features/areas/types/area";
import type { Place } from "../../types/place";
import { PhotoPreviewDialog } from "../../components/photo-preview-dialog";
import { PlaceLocationPicker } from "./place-location-picker";
import { toast } from "sonner";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

function FormSelect({
  id,
  label,
  field,
  children,
}: {
  id: string;
  label: string;
  field: AnyFieldApi;
  children: ReactNode;
}) {
  const messages = errorMessages(field.state.meta.errors);
  return (
    <Field data-invalid={messages.length > 0}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        name={field.name}
        value={field.state.value as string}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={messages.length > 0}
        className="h-8 border border-input bg-background px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
      >
        {children}
      </select>
      <FieldError errors={messages.map((message) => ({ message }))} />
    </Field>
  );
}

export function AdminPlaceForm({
  categories,
  areas,
  place,
  existingSlugs,
  onSaved,
  onCancel,
}: {
  categories: Category[];
  areas: Area[];
  place: Place | null;
  existingSlugs: string[];
  onSaved: (place: Place) => void;
  onCancel: () => void;
}) {
  const [latitude, setLatitude] = useState(place?.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(place?.longitude?.toString() ?? "");
  const [photos, setPhotos] = useState<string[]>([...(place?.photos ?? [])]);
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([]);
  // Selected but not yet uploaded. Nothing reaches storage until submit,
  // so closing the sheet early can never orphan files.
  const [pending, setPending] = useState<{ id: string; file: File; previewUrl: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  // Slug auto-fills from the English name until the admin types one;
  // editing a place that already has a slug never overwrites it.
  const [slugTouched, setSlugTouched] = useState(!!place?.slug);

  // Object URLs are local-only; revoke leftovers if the sheet closes early.
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  useEffect(
    () => () => {
      pendingRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    },
    [],
  );

  const allPhotos = [...photos, ...pending.map((item) => item.previewUrl)];

  const form = useForm({
    defaultValues: {
      nameMy: place?.nameMy ?? "",
      nameEn: place?.nameEn ?? "",
      slug: place?.slug ?? "",
      descriptionMy: place?.descriptionMy ?? "",
      categoryId: place?.categoryId ?? categories[0]?.id ?? "",
      areaId: place?.areaId ?? "",
      addressText: place?.addressText ?? "",
      phone: place?.phone ?? "",
      phoneSecondary: place?.phoneSecondary ?? "",
      facebookUrl: place?.facebookUrl ?? "",
      telegramHandle: place?.telegramHandle ?? "",
      hoursText: place?.hoursText ?? "",
      priceLevel: place?.priceLevel ?? "",
      priceNote: place?.priceNote ?? "",
      tags: place?.tags ?? [],
      isActive: place?.isActive ?? true,
    } satisfies PlaceFormValues,
    validators: { onSubmit: placeFormSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      const slug = toOptional(value.slug)?.toLowerCase();
      if (slug && existingSlugs.includes(slug)) {
        setError(`Slug "${slug}" is already used by another place`);
        return;
      }
      setIsSaving(true);
      // Upload staged files first. On failure the batch URLs are deleted
      // again, so a failed save never leaves orphans behind either.
      const uploaded: string[] = [];
      const input: PlaceInput = {
        nameMy: value.nameMy.trim(),
        nameEn: toOptional(value.nameEn),
        slug,
        descriptionMy: toOptional(value.descriptionMy),
        categoryId: value.categoryId,
        areaId: toOptional(value.areaId),
        addressText: toOptional(value.addressText),
        phone: toOptional(value.phone),
        phoneSecondary: toOptional(value.phoneSecondary),
        facebookUrl: toOptional(value.facebookUrl),
        telegramHandle: toOptional(value.telegramHandle),
        hoursText: toOptional(value.hoursText),
        priceLevel: toOptional(value.priceLevel) as PlaceInput["priceLevel"],
        priceNote: toOptional(value.priceNote),
        tags: value.tags,
        latitude: latitude ? Number(latitude) : place ? null : undefined,
        longitude: longitude ? Number(longitude) : place ? null : undefined,
        photos,
        isActive: value.isActive,
      };
      try {
        let convertedCount = 0;
        let convertedBytes = 0;
        for (const item of pendingRef.current) {
          const prepared = await prepareImageForUpload(item.file);
          if (prepared.converted) {
            convertedCount += 1;
            convertedBytes += prepared.savedBytes;
          }
          const ticket = await requestUpload(prepared.file.type);
          const response = await fetch(ticket.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": prepared.file.type },
            body: prepared.file,
          });
          if (!response.ok) throw new Error(`Could not upload ${item.file.name}`);
          uploaded.push(ticket.url);
        }
        if (convertedCount > 0) {
          const savedKb = Math.round(convertedBytes / 1024);
          toast.success(formatPhotoShrinkHint(convertedCount, savedKb));
        }
        input.photos = [...photos, ...uploaded];
        const saved = place ? await updatePlace(place.id, input) : await createPlace(input);
        try {
          await Promise.all(removedPhotos.map((url) => removeUpload(url)));
        } catch {
          setError(
            "Place saved, but some removed photos could not be deleted. Save again to retry.",
          );
          return;
        }
        setRemovedPhotos([]);
        pendingRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        setPending([]);
        onSaved(saved);
      } catch (requestError) {
        // The place was not saved, so batch URLs would orphan — delete them.
        await Promise.allSettled(uploaded.map((url) => removeUpload(url)));
        setError(requestError instanceof Error ? requestError.message : "Could not save place");
      } finally {
        setIsSaving(false);
      }
    },
  });

  const nameEnValue = useStore(form.store, (state) => state.values.nameEn);
  useEffect(() => {
    if (!slugTouched && nameEnValue.trim()) {
      form.setFieldValue("slug", slugifyPlaceName(nameEnValue) ?? "");
    }
  }, [nameEnValue, slugTouched, form]);

  function stageFiles(files: File[]) {
    if (files.length === 0) return;
    setPhotoError(null);
    for (const file of files) {
      if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        setPhotoError(`Unsupported file type: ${file.name}`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setPhotoError(`${file.name} is larger than 5 MB`);
        continue;
      }
      setPending((current) => [
        ...current,
        { id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) },
      ]);
    }
  }

  function removePending(id: string) {
    const item = pendingRef.current.find((entry) => entry.id === id);
    if (item) URL.revokeObjectURL(item.previewUrl);
    setPending((current) => current.filter((entry) => entry.id !== id));
  }

  function handleCancel() {
    pendingRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setPending([]);
    onCancel();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      aria-label="Place form"
    >
      <FieldGroup className="gap-4 border-t pt-4">
        <p className="text-sm font-medium">Details</p>
        <form.Field name="nameMy">
          {(field) => <FormTextField id="nameMy" label="Name in Myanmar *" field={field} />}
        </form.Field>
        <form.Field name="nameEn">
          {(field) => <FormTextField id="nameEn" label="English name" field={field} />}
        </form.Field>
        <form.Field name="slug">
          {(field) => {
            const messages = errorMessages(field.state.meta.errors);
            const trimmed = field.state.value.trim().toLowerCase();
            return (
              <Field data-invalid={messages.length > 0}>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  id="slug"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    setSlugTouched(true);
                    field.handleChange(event.target.value);
                  }}
                  placeholder="e.g. shan-noodle-shop"
                  aria-invalid={messages.length > 0}
                  aria-describedby="slug-preview"
                />
                <p id="slug-preview" className="text-xs text-muted-foreground">
                  {trimmed
                    ? `Public page: /places/${trimmed}`
                    : "Leave empty to generate from the English name on save."}
                </p>
                <FieldError errors={messages.map((message) => ({ message }))} />
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="categoryId">
          {(field) => (
            <FormSelect id="categoryId" label="Category *" field={field}>
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameMy}
                  {category.nameEn ? ` · ${category.nameEn}` : ""}
                </option>
              ))}
            </FormSelect>
          )}
        </form.Field>
        <form.Field name="areaId">
          {(field) => (
            <FormSelect id="areaId" label="Area" field={field}>
              <option value="">No area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nameMy}
                  {area.nameEn ? ` · ${area.nameEn}` : ""}
                </option>
              ))}
            </FormSelect>
          )}
        </form.Field>
        <form.Field name="priceLevel">
          {(field) => (
            <FormSelect id="priceLevel" label="Price level" field={field}>
              <option value="">No price level</option>
              {(Object.keys(PRICE_LEVEL_LABELS) as (keyof typeof PRICE_LEVEL_LABELS)[]).map(
                (level) => (
                  <option key={level} value={level}>
                    {PRICE_LEVEL_LABELS[level].symbol} · {PRICE_LEVEL_LABELS[level].name}
                  </option>
                ),
              )}
            </FormSelect>
          )}
        </form.Field>
        <form.Field name="descriptionMy">
          {(field) => {
            const messages = errorMessages(field.state.meta.errors);
            return (
              <Field data-invalid={messages.length > 0}>
                <FieldLabel htmlFor="descriptionMy">Description</FieldLabel>
                <Textarea
                  id="descriptionMy"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={messages.length > 0}
                />
                <FieldError errors={messages.map((message) => ({ message }))} />
              </Field>
            );
          }}
        </form.Field>
        <div className="grid gap-1">
          <Label htmlFor="photos">Photos</Label>
          <Input
            id="photos"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple
            disabled={isSaving}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              stageFiles(files);
            }}
          />
          {allPhotos.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {[
                ...photos.map((photo, index) => ({
                  key: photo,
                  src: photo,
                  label: `Photo ${index + 1}`,
                  onPreview: () => setPreviewIndex(index),
                  onRemove: () => {
                    setRemovedPhotos((current) => [...current, photo]);
                    setPhotos((current) => current.filter((_, i) => i !== index));
                  },
                })),
                ...pending.map((item, pendingIndex) => ({
                  key: item.id,
                  src: item.previewUrl,
                  label: `New photo ${pendingIndex + 1}`,
                  onPreview: () => setPreviewIndex(photos.length + pendingIndex),
                  onRemove: () => removePending(item.id),
                })),
              ].map((thumb) => (
                <Attachment key={thumb.key} size="sm" state="done" className="min-w-0">
                  <AttachmentMedia variant="image">
                    <img src={thumb.src} alt={thumb.label} />
                  </AttachmentMedia>
                  <AttachmentTrigger
                    onClick={thumb.onPreview}
                    aria-label={`Preview ${thumb.label.toLowerCase()}`}
                  />
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={`Remove ${thumb.label.toLowerCase()}`}
                      onClick={thumb.onRemove}
                    >
                      <X />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}
            </div>
          ) : null}
          {photoError ? (
            <p role="alert" className="text-destructive text-xs">
              {photoError}
            </p>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["addressText", "Address"],
              ["phone", "Phone"],
              ["phoneSecondary", "Second phone"],
              ["facebookUrl", "Facebook URL"],
              ["telegramHandle", "Telegram handle"],
              ["hoursText", "Hours"],
              ["priceNote", "Price note"],
            ] as const
          ).map(([key, label]) => (
            <form.Field key={key} name={key}>
              {(field) => <FormTextField id={key} label={label} field={field} />}
            </form.Field>
          ))}
        </div>
        <form.Field name="tags">
          {(field) => (
            <div className="grid gap-2">
              <span id="place-tags-label" className="text-sm font-medium">
                Tags
              </span>
              <div role="group" aria-labelledby="place-tags-label" className="flex flex-wrap gap-2">
                {PLACE_TAGS.map((tag) => {
                  const checked = field.state.value.includes(tag);
                  return (
                    <label
                      key={tag}
                      className={cn(
                        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
                        "outline-offset-2 focus-within:outline-2",
                        checked
                          ? "border-primary bg-muted font-medium"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(next) => {
                          const on = next === true;
                          field.handleChange(
                            on
                              ? [...field.state.value, tag]
                              : field.state.value.filter((item) => item !== tag),
                          );
                        }}
                        aria-label={PLACE_TAG_LABELS[tag]}
                      />
                      {PLACE_TAG_LABELS[tag]}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </form.Field>
        <div className="grid gap-2">
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-xs text-muted-foreground">
              Tap the map or drag the marker to set the Place location.
            </p>
          </div>
          <PlaceLocationPicker
            latitude={latitude ? Number(latitude) : undefined}
            longitude={longitude ? Number(longitude) : undefined}
            onChange={(nextLatitude, nextLongitude) => {
              setLatitude(nextLatitude?.toFixed(6) ?? "");
              setLongitude(nextLongitude?.toFixed(6) ?? "");
            }}
          />
        </div>
        <form.Field name="isActive">
          {(field) => (
            <Field orientation="horizontal">
              <input
                type="checkbox"
                id="isActive"
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              />
              <FieldLabel htmlFor="isActive">Visible in public directory</FieldLabel>
            </Field>
          )}
        </form.Field>
        {error ? (
          <p role="alert" className="text-destructive text-xs">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : place ? "Save changes" : "Create place"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </FieldGroup>
      <form.Subscribe selector={(state) => state.values.nameMy}>
        {(nameMy) => (
          <PhotoPreviewDialog
            photos={allPhotos}
            index={previewIndex ?? 0}
            placeName={nameMy}
            open={previewIndex !== null}
            onOpenChange={(open) => {
              if (!open) setPreviewIndex(null);
            }}
            onIndexChange={setPreviewIndex}
          />
        )}
      </form.Subscribe>
    </form>
  );
}
