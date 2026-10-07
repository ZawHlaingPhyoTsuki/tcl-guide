"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormTextField } from "@/components/ui/form-text-field";
import { toOptional } from "@/lib/form";

import { createCategory, updateCategory } from "../../categories-actions";
import { categoryFormSchema, type CategoryFormValues } from "../../categories-schema";
import type { AdminCategory } from "../../types/category";

export function AdminCategoryForm({
  category,
  onSaved,
  onCancel,
}: {
  category: AdminCategory | null;
  onSaved: (category: AdminCategory) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      slug: category?.slug ?? "",
      nameMy: category?.nameMy ?? "",
      nameEn: category?.nameEn ?? "",
    } satisfies CategoryFormValues,
    validators: { onSubmit: categoryFormSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      setIsSaving(true);
      const nameEn = toOptional(value.nameEn);
      try {
        const saved = category
          ? await updateCategory(category.id, { nameMy: value.nameMy.trim(), nameEn })
          : await createCategory({ slug: value.slug.trim(), nameMy: value.nameMy.trim(), nameEn });
        onSaved(saved);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Could not save category");
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
      aria-label="Category form"
    >
      <FieldGroup className="gap-4 border-t pt-4">
        {category ? (
          <div className="grid gap-1">
            <p className="text-sm font-medium">Slug</p>
            <p className="text-xs text-muted-foreground">
              {category.slug} · used in public filter URLs, cannot be changed
            </p>
          </div>
        ) : (
          <form.Field name="slug">
            {(field) => (
              <FormTextField
                id="slug"
                label="Slug *"
                placeholder="e.g. street_food"
                field={field}
                hint={
                  <p className="text-xs text-muted-foreground">
                    Used in public filter URLs, e.g. ?category=street_food. Cannot be changed later.
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
            {isSaving ? "Saving..." : category ? "Save changes" : "Create category"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
