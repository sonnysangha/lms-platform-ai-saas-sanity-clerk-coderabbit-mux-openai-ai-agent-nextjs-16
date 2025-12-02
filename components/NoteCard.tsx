"use client";

import { useState } from "react";
import {
  useEditDocument,
  useDocument,
  useApplyDocumentActions,
  publishDocument,
  unpublishDocument,
  deleteDocument,
  discardDocument,
  useDocumentEvent,
  createDocumentHandle,
  useQuery,
} from "@sanity/sdk-react";
import type { Note } from "@/sanity.types";

interface NoteCardProps {
  documentId: string;
}

export function NoteCard({ documentId }: NoteCardProps) {
  const [notifications, setNotifications] = useState<string[]>([]);

  // Document handle for event listening and better type inference with TypeGen
  const documentHandle = createDocumentHandle({
    documentId,
    documentType: "note",
  });

  const { data: note } = useDocument<Note>({
    documentId,
    documentType: "note",
  });

  const apply = useApplyDocumentActions();

  // Check if document is published or draft in realtime
  const isDraft = note?._id.startsWith("drafts.");
  const isPublished = !isDraft;

  // Check if a published version exists (for draft-only documents)
  const { data: publishedDoc } = useQuery<{ _id: string } | null>({
    query: `*[_id == $id][0]{ _id }`,
    params: { id: documentId },
    perspective: "published",
  });
  const hasPublishedVersion = !!publishedDoc;

  // Listen to document events
  useDocumentEvent({
    ...documentHandle,
    onEvent: (event) => {
      const timestamp = new Date().toLocaleTimeString();
      switch (event.type) {
        case "edited":
          setNotifications((prev) => [
            `${timestamp} - Edited`,
            ...prev.slice(0, 4), // Keep last 5 notifications
          ]);
          break;
        case "published":
          setNotifications((prev) => [
            `${timestamp} - Published`,
            ...prev.slice(0, 4),
          ]);
          break;
        case "unpublished":
          setNotifications((prev) => [
            `${timestamp} - Unpublished`,
            ...prev.slice(0, 4),
          ]);
          break;
        case "deleted":
          setNotifications((prev) => [
            `${timestamp} - Deleted`,
            ...prev.slice(0, 4),
          ]);
          break;
        case "created":
          setNotifications((prev) => [
            `${timestamp} - Created`,
            ...prev.slice(0, 4),
          ]);
          break;
      }
    },
  });

  const editTitle = useEditDocument<string>({
    documentId,
    documentType: "note",
    path: "title",
  });

  const editContent = useEditDocument<string>({
    documentId,
    documentType: "note",
    path: "content",
  });

  const editStatus = useEditDocument<"draft" | "inProgress" | "complete">({
    documentId,
    documentType: "note",
    path: "status",
  });

  if (!note) return null;

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      {notifications.length > 0 && (
        <div className="mb-4 space-y-1">
          {notifications.map((msg, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Event notifications are transient and order-based
              key={i}
              className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
            >
              {msg}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <input
          type="text"
          value={note.title || ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          className="text-xl font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none flex-1 mr-4"
          placeholder="Enter title..."
        />
        <div className="flex items-center gap-2">
          <select
            value={note.status || "draft"}
            onChange={(e) =>
              editStatus(
                e.currentTarget.value as "draft" | "inProgress" | "complete",
              )
            }
            className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
              note.status === "complete"
                ? "bg-green-100 text-green-800"
                : note.status === "inProgress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            <option value="draft">Draft</option>
            <option value="inProgress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isPublished
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isPublished ? "✓ Published" : "📝 Draft"}
        </span>
        {isPublished ? (
          <button
            type="button"
            onClick={() =>
              apply(
                unpublishDocument({
                  documentId: note._id,
                  documentType: "note",
                }),
              )
            }
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
          >
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              apply(
                publishDocument({
                  documentId: note._id.replace("drafts.", ""),
                  documentType: "note",
                }),
              )
            }
            className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded"
          >
            Publish
          </button>
        )}
        <button
          type="button"
          onClick={async () => {
            const baseId = note._id.replace("drafts.", "");

            if (isDraft && hasPublishedVersion) {
              // For drafts with published version, discard to revert
              await apply(
                discardDocument({
                  documentId: baseId,
                  documentType: "note",
                }),
              );
            } else if (isDraft && !hasPublishedVersion) {
              // For draft-only documents (no published version), publish first then delete
              await apply([
                publishDocument({
                  documentId: baseId,
                  documentType: "note",
                }),
                deleteDocument({
                  documentId: baseId,
                  documentType: "note",
                }),
              ]);
            } else {
              // For published documents, use deleteDocument
              await apply(
                deleteDocument({
                  documentId: note._id,
                  documentType: "note",
                }),
              );
            }
          }}
          className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded ml-auto"
        >
          {isDraft && hasPublishedVersion ? "Discard Draft" : "Delete"}
        </button>
      </div>

      <textarea
        value={note.content || ""}
        onChange={(e) => editContent(e.currentTarget.value)}
        className="w-full text-muted-foreground mb-2 bg-transparent border border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded min-h-[80px] resize-y"
        placeholder="Enter content..."
      />
      <p className="text-xs text-muted-foreground">
        Created: {new Date(note._createdAt).toLocaleString()}
      </p>
    </div>
  );
}
