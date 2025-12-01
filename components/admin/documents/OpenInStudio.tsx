"use client";

import Link from "next/link";
import type { DocumentHandle } from "@sanity/sdk-react";
import { ExternalLink } from "lucide-react";

interface OpenInStudioProps {
  handle: DocumentHandle;
}

export function OpenInStudio({ handle }: OpenInStudioProps) {
  // Construct the Studio URL for the document
  // Format: /studio/structure/[documentType];[documentId]
  const studioUrl = `/studio/structure/${handle.documentType};${handle.documentId}`;

  return (
    <Link
      href={studioUrl}
      target="_blank"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
    >
      <ExternalLink className="h-4 w-4" />
      Open in Studio
    </Link>
  );
}
