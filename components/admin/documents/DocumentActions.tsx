"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  useApplyDocumentActions,
  publishDocument,
  unpublishDocument,
  discardDocument,
  deleteDocument,
  type DocumentHandle,
  useDocument,
  useQuery,
} from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Trash2, Download, RotateCcw } from "lucide-react";

/**
 * DocumentActions
 *
 * - isDraft: doc._id.startsWith("drafts.") - checks if viewing a draft (real-time)
 * - hasPublishedVersion: useQuery - checks if published version exists (for Discard visibility)
 *
 * Button logic:
 * - Discard: isDraft && hasPublishedVersion (can only revert if published version exists)
 * - Publish: isDraft (push draft changes)
 * - Unpublish: !isDraft (only when viewing published version)
 */

interface DocumentActionsProps extends DocumentHandle {}

function DocumentActionsFallback() {
  return (
    <div className="flex items-center justify-between w-full">
      <Skeleton className="h-6 w-16 bg-zinc-800" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24 bg-zinc-800" />
        <Skeleton className="h-9 w-9 bg-zinc-800" />
      </div>
    </div>
  );
}

function DocumentActionsContent({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentActionsProps) {
  const router = useRouter();
  const apply = useApplyDocumentActions();

  const baseId = documentId.replace("drafts.", "");

  // Real-time document state (for editing)
  const { data: doc } = useDocument({
    documentId,
    documentType,
    projectId,
    dataset,
  });

  const { data: publishedDoc } = useQuery<{
    _id: string;
  } | null>({
    query: `*[_id == $id][0]{ _id }`,
    params: { id: baseId },
    perspective: "published",
  });

  const isDraft = doc?._id.startsWith("drafts.");
  const hasPublishedVersion = !!publishedDoc;

  const getListUrl = () => {
    if (documentType === "category") return "/admin/categories";
    return `/admin/${documentType}s`;
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Draft badge - only shown when in draft mode */}
      {isDraft && (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Draft
        </span>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Discard changes - only when in draft AND published version exists */}
        {isDraft && hasPublishedVersion && (
          <button
            onClick={() => {
              const confirmed = window.confirm(
                "Discard all changes? This will revert to the published version.",
              );
              if (!confirmed) return;
              apply(
                discardDocument({
                  documentId: baseId,
                  documentType,
                }),
              );
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Discard
          </button>
        )}

        {/* Unpublish - only when viewing published version (not draft) */}
        {!isDraft && (
          <button
            onClick={() =>
              apply(
                unpublishDocument({
                  documentId: baseId,
                  documentType,
                }),
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <Download className="h-4 w-4" />
            Unpublish
          </button>
        )}

        {/* Publish - only when in draft mode */}
        {isDraft && (
          <button
            onClick={() =>
              apply(
                publishDocument({
                  documentId: baseId,
                  documentType,
                }),
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg shadow-lg shadow-violet-500/20 transition-all"
          >
            <Upload className="h-4 w-4" />
            Publish
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={() => {
            const confirmed = window.confirm(
              "Delete this document permanently? This cannot be undone.",
            );
            if (!confirmed) return;

            apply(
              deleteDocument({
                documentId: baseId,
                documentType,
              }),
            );
            router.push(getListUrl());
          }}
          className="h-8 w-8 inline-flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function DocumentActions(props: DocumentActionsProps) {
  return (
    <Suspense fallback={<DocumentActionsFallback />}>
      <DocumentActionsContent {...props} />
    </Suspense>
  );
}
