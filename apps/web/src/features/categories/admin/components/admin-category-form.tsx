"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { errorMessages } from "@/lib/form";

import { createCategory, updateCategory } from "../actions";
import { categoryFormSchema, type CategoryFormValues } from "../schema";
import type { AdminCategory } from "../../types";

function toOptional(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

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
            {(field) => {
              const messages = errorMessages(field.state.meta.errors);
              return (
                <Field data-invalid={messages.length > 0}>
                  <FieldLabel htmlFor="slug">Slug *</FieldLabel>
                  <Input
                    id="slug"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. street_food"
                    aria-invalid={messages.length > 0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in public filter URLs, e.g. ?category=street_food. Cannot be changed later.
                  </p>
                  <FieldError errors={messages.map((message) => ({ message }))} />
                </Field>
              );
            }}
          </form.Field>
        )}
        <form.Field name="nameMy">
          {(field) => {
            const messages = errorMessages(field.state.meta.errors);
            return (
              <Field data-invalid={messages.length > 0}>
                <FieldLabel htmlFor="nameMy">Name in Myanmar *</FieldLabel>
                <Input
                  id="nameMy"
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
        <form.Field name="nameEn">
          {(field) => {
            const messages = errorMessages(field.state.meta.errors);
            return (
              <Field data-invalid={messages.length > 0}>
                <FieldLabel htmlFor="nameEn">English name</FieldLabel>
                <Input
                  id="nameEn"
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
