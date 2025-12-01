"use client";

import { Suspense } from "react";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { ReferenceArrayInput } from "@/components/admin/inputs/ReferenceArrayInput";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";

interface ModuleEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function ModuleEditorFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-2/3 bg-zinc-800" />
      <Skeleton className="h-20 w-full bg-zinc-800" />
      <Skeleton className="h-[300px] w-full bg-zinc-800" />
    </div>
  );
}

function ModuleEditorContent({
  documentId,
  projectId,
  dataset,
}: ModuleEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "module",
    projectId,
    dataset,
  };

  const { data: title } = useDocument<string>({ ...handle, path: "title" });
  const { data: description } = useDocument<string>({
    ...handle,
    path: "description",
  });
  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editDescription = useEditDocument<string>({
    ...handle,
    path: "description",
  });

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <OpenInStudio handle={handle} />
      </div>

      {/* Header section */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 mb-6">
        {/* Title input */}
        <Input
          value={title ?? ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          placeholder="Untitled Module"
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
      </div>

      {/* Lessons section */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
        <ReferenceArrayInput
          documentId={documentId}
          documentType="module"
          projectId={projectId}
          dataset={dataset}
          path="lessons"
          label="Lessons"
          referenceType="lesson"
        />
      </div>
    </div>
  );
}

export function ModuleEditor(props: ModuleEditorProps) {
  return (
    <Suspense fallback={<ModuleEditorFallback />}>
      <ModuleEditorContent {...props} />
    </Suspense>
  );
}
