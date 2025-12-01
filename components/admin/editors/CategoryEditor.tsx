"use client";

import { Suspense } from "react";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { Label } from "@/components/ui/label";

interface CategoryEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function CategoryEditorFallback() {
  return (
    <div className="max-w-2xl space-y-6">
      <Skeleton className="h-12 w-2/3 bg-zinc-800" />
      <Skeleton className="h-20 w-full bg-zinc-800" />
      <Skeleton className="h-24 w-full bg-zinc-800" />
    </div>
  );
}

function CategoryEditorContent({
  documentId,
  projectId,
  dataset,
}: CategoryEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "category",
    projectId,
    dataset,
  };

  const { data: title } = useDocument<string>({ ...handle, path: "title" });
  const { data: description } = useDocument<string>({
    ...handle,
    path: "description",
  });
  const { data: icon } = useDocument<string>({ ...handle, path: "icon" });
  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editDescription = useEditDocument<string>({
    ...handle,
    path: "description",
  });
  const editIcon = useEditDocument<string>({ ...handle, path: "icon" });

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-end mb-3">
        <OpenInStudio handle={handle} />
      </div>

      {/* Main card */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
        {/* Title input */}
        <Input
          value={title ?? ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          placeholder="Untitled Category"
          className="text-2xl font-semibold text-white border-none shadow-none h-auto py-1 focus-visible:ring-0 bg-transparent placeholder:text-zinc-600"
        />

        {/* Description */}
        <Textarea
          value={description ?? ""}
          onChange={(e) => editDescription(e.currentTarget.value)}
          placeholder="Add a description..."
          className="text-zinc-400 border-none shadow-none resize-none focus-visible:ring-0 bg-transparent placeholder:text-zinc-600 mt-2"
          rows={2}
        />

        {/* Actions */}
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-zinc-800">
          <DocumentActions {...handle} />
        </div>

        {/* Icon field */}
        <div className="mt-6 pt-6 border-t border-zinc-800 space-y-2">
          <Label htmlFor="icon" className="text-zinc-300">
            Icon
          </Label>
          <Input
            id="icon"
            value={icon ?? ""}
            onChange={(e) => editIcon(e.currentTarget.value)}
            placeholder="lucide icon name (e.g., code, palette)"
            className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <p className="text-xs text-zinc-500">
            Use any icon name from lucide-react
          </p>
        </div>
      </div>
    </div>
  );
}

export function CategoryEditor(props: CategoryEditorProps) {
  return (
    <Suspense fallback={<CategoryEditorFallback />}>
      <CategoryEditorContent {...props} />
    </Suspense>
  );
}
