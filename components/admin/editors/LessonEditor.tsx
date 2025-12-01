"use client";

import { Suspense } from "react";
import Link from "next/link";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { VideoIcon, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

interface LessonEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

interface MuxVideoAsset {
  _type: "reference";
  _ref: string;
}

interface MuxVideo {
  _type: "mux.video";
  asset?: MuxVideoAsset;
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
  const { data: video } = useDocument<MuxVideo>({ ...handle, path: "video" });

  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editDescription = useEditDocument<string>({
    ...handle,
    path: "description",
  });

  // Check if video is uploaded by looking for asset reference
  const hasVideo = Boolean(video?.asset?._ref);

  // Studio URL for the video tab - using the video group
  const studioVideoUrl = `/studio/structure/lesson;${documentId},video`;

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
          placeholder="Untitled Lesson"
          className="text-2xl font-semibold text-white border-none shadow-none px-0 h-auto py-1 focus-visible:ring-0 bg-transparent placeholder:text-zinc-600"
        />

        {/* Description */}
        <Textarea
          value={description ?? ""}
          onChange={(e) => editDescription(e.currentTarget.value)}
          placeholder="Add a description..."
          className="text-zinc-400 border-none shadow-none px-0 resize-none focus-visible:ring-0 bg-transparent placeholder:text-zinc-600 mt-2"
          rows={2}
        />

        {/* Slug */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <SlugInput
            {...handle}
            path="slug"
            label="URL Slug"
            sourceField="title"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-zinc-800">
          <DocumentActions {...handle} />
        </div>
      </div>

      {/* Video status section - compact */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800">
              <VideoIcon className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-white">Video</span>
              {hasVideo ? (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-400 border border-zinc-700"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  No video
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Link href={studioVideoUrl} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              {hasVideo ? "Manage in Studio" : "Upload in Studio"}
            </Link>
          </Button>
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
