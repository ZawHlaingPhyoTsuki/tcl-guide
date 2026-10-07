"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { TagIcon } from "lucide-react";

import { deleteCategory } from "../../categories-actions";
import { AdminCategoryForm } from "./admin-category-form";
import type { AdminCategory } from "../../types/category";

export function AdminCategories({ initialCategories }: { initialCategories: AdminCategory[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function savedCategory(saved: AdminCategory) {
    setCategories((current) => {
      const exists = current.some((item) => item.id === saved.id);
      return exists
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...current];
    });
    setEditing(null);
    setIsCreating(false);
  }

  async function remove(category: AdminCategory) {
    setError(null);
    setBusy(category.id);
    try {
      await deleteCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      setDeleting(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete category");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">
            How places are grouped in the public directory
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setIsCreating(true);
          }}
        >
          Add a category
        </Button>
      </div>
      <Dialog
        open={isCreating || Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setIsCreating(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.nameMy}` : "Add a category"}</DialogTitle>
            <DialogDescription>
              Slugs become public filter URLs; names can be changed anytime.
            </DialogDescription>
          </DialogHeader>
          <AdminCategoryForm
            key={editing?.id ?? "new"}
            category={editing}
            onSaved={savedCategory}
            onCancel={() => {
              setEditing(null);
              setIsCreating(false);
            }}
          />
        </DialogContent>
      </Dialog>
      {error ? (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
      {categories.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TagIcon />
            </EmptyMedia>
            <EmptyTitle>No categories yet</EmptyTitle>
            <EmptyDescription>Add the first category to group places.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ItemGroup>
          {categories.map((category) => (
            <Item
              key={category.id}
              size="sm"
              variant="outline"
              className="bg-card hover:bg-muted/30"
            >
              <ItemContent>
                <ItemTitle>
                  {category.nameMy}
                  {category.nameEn ? (
                    <span className="text-muted-foreground">{category.nameEn}</span>
                  ) : null}
                </ItemTitle>
                <ItemDescription>?category={category.slug}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline" className="tabular-nums">
                  {category.placeCount} {category.placeCount === 1 ? "place" : "places"}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditing(category);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={category.placeCount > 0 || busy === category.id}
                  title={
                    category.placeCount > 0
                      ? "Move its places to another category first"
                      : undefined
                  }
                  onClick={() => setDeleting(category.id)}
                >
                  {busy === category.id ? "Deleting..." : "Delete"}
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this category?</DialogTitle>
            <DialogDescription>
              This permanently removes the category. It only applies to categories with no places.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Keep category
            </Button>
            <Button
              variant="destructive"
              disabled={!deleting || busy === deleting}
              onClick={() => {
                const category = categories.find((item) => item.id === deleting);
                if (category) void remove(category);
              }}
            >
              {deleting && busy === deleting ? "Deleting..." : "Delete category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminCategoriesSkeleton() {
  return (
    <div className="grid gap-2" aria-busy="true" aria-label="Loading categories">
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} className="h-16 w-full" />
      ))}
    </div>
  );
}
