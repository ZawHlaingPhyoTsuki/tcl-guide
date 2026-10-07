"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/form-text-field";
import { toOptional } from "@/lib/form";

import { createArea, updateArea } from "../../areas-actions";
import { areaFormSchema, type AreaFormValues } from "../../areas-schema";
import type { AdminArea } from "../../types/area";

export function AdminAreaForm({
  area,
  onSaved,
  onCancel,
}: {
  area: AdminArea | null;
  onSaved: (area: AdminArea) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      slug: area?.slug ?? "",
      nameMy: area?.nameMy ?? "",
      nameEn: area?.nameEn ?? "",
    } satisfies AreaFormValues,
    validators: { onSubmit: areaFormSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      setIsSaving(true);
      const nameEn = toOptional(value.nameEn);
      try {
        const saved = area
          ? await updateArea(area.id, { nameMy: value.nameMy.trim(), nameEn })
          : await createArea({ slug: value.slug.trim(), nameMy: value.nameMy.trim(), nameEn });
        onSaved(saved);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Could not save area");
      } finally {
        setIsSaving(false);
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      aria-label="Area form"
    >
      <FieldGroup className="gap-4 border-t pt-4">
        {area ? (
          <div className="grid gap-1">
            <p className="text-sm font-medium">Slug</p>
            <p className="text-xs text-muted-foreground">
              {area.slug} · used in public filter URLs, cannot be changed
            </p>
          </div>
        ) : (
          <form.Field name="slug">
            {(field) => (
              <FormTextField
                id="slug"
                label="Slug *"
                placeholder="e.g. san-sai"
                field={field}
                hint={
                  <p className="text-xs text-muted-foreground">
                    Used in public filter URLs, e.g. ?area=san-sai. Cannot be changed later.
                  </p>
                }
              />
            )}
          </form.Field>
        )}
        <form.Field name="nameMy">
          {(field) => <FormTextField id="nameMy" label="Name in Myanmar *" field={field} />}
        </form.Field>
        <form.Field name="nameEn">
          {(field) => <FormTextField id="nameEn" label="English name" field={field} />}
        </form.Field>
        {error ? (
          <p role="alert" className="text-destructive text-xs">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : area ? "Save changes" : "Create area"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
