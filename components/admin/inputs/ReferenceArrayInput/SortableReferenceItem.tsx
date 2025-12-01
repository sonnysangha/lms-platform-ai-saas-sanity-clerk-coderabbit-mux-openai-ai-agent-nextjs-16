"use client";

import Link from "next/link";
import { useDocumentProjection } from "@sanity/sdk-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, GripVertical, ExternalLink } from "lucide-react";

interface SortableReferenceItemProps {
  id: string;
  documentId: string;
  documentType: string;
  projectId: string;
  dataset: string;
  onRemove: () => void;
}

export function SortableReferenceItem({
  id,
  documentId,
  documentType,
  projectId,
  dataset,
  onRemove,
}: SortableReferenceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: "{ title }",
  });

  const title = (data as { title?: string })?.title || "Untitled";
  const editUrl = `/admin/${documentType}s/${documentId}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing touch-none text-zinc-500 hover:text-zinc-300"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Link
        href={editUrl}
        className="text-sm text-zinc-300 flex-1 hover:text-violet-400 hover:underline transition-colors flex items-center gap-2"
      >
        {title}
        <ExternalLink className="h-3 w-3 opacity-50" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
