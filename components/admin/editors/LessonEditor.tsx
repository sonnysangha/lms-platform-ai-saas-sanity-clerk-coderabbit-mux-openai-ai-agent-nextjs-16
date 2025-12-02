"use client";

import { Suspense } from "react";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { MuxVideoInput } from "@/components/admin/inputs/MuxVideoInput";
import { PortableTextInput } from "@/components/admin/inputs/PortableTextInput";

interface LessonEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function LessonEditorFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-2/3 bg-zinc-800" />
      <Skeleton className="h-20 w-full bg-zinc-800" />
      <Skeleton className="h-16 w-full bg-zinc-800" />
    </div>
  );
}

function LessonEditorContent({
  documentId,
  projectId,
  dataset,
}: LessonEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "lesson",
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
    <div className="space-y-4">
      {/* Top bar with actions */}
      <div className="flex items-center justify-end gap-3">
        <DocumentActions {...handle} />
        <div className="h-6 w-px bg-zinc-700" />
        <OpenInStudio handle={handle} />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column - Content details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title & Description */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <Input
              value={title ?? ""}
              onChange={(e) => editTitle(e.currentTarget.value)}
              placeholder="Untitled Lesson"
              className="text-2xl font-semibold text-white border-none shadow-none h-auto py-1 focus-visible:ring-0 bg-transparent placeholder:text-zinc-600"
            />
            <Textarea
              value={description ?? ""}
              onChange={(e) => editDescription(e.currentTarget.value)}
              placeholder="Add a description..."
              className="text-zinc-400 border-none shadow-none resize-none focus-visible:ring-0 bg-transparent placeholder:text-zinc-600 mt-3"
              rows={3}
            />
          </div>

          {/* Settings */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Settings</h3>
            <SlugInput
              {...handle}
              path="slug"
              label="URL Slug"
              sourceField="title"
            />
          </div>

          {/* Lesson Content - Rich Text Editor */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">
              Lesson Content
            </h3>
            <PortableTextInput {...handle} path="content" label="Content" />
          </div>
        </div>

        {/* Right column - Video */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 lg:sticky lg:top-6">
            <MuxVideoInput {...handle} path="video" label="Lesson Video" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LessonEditor(props: LessonEditorProps) {
  return (
    <Suspense fallback={<LessonEditorFallback />}>
      <LessonEditorContent {...props} />
    </Suspense>
  );
}
