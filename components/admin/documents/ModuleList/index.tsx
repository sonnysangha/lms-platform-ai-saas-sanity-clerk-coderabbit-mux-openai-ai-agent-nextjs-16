"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useApplyDocumentActions,
  createDocument,
  createDocumentHandle,
} from "@sanity/sdk-react";
import { ListPageHeader, SearchInput } from "@/components/admin/shared";
import { ModuleListSkeleton } from "@/components/admin/shared/DocumentSkeleton";
import { ModuleListContent } from "./ModuleListContent";
import type { ModuleListProps } from "./types";

export function ModuleList({ projectId, dataset }: ModuleListProps) {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const apply = useApplyDocumentActions();

  const handleCreateModule = () => {
    startTransition(async () => {
      const newDocHandle = createDocumentHandle({
        documentId: crypto.randomUUID(),
        documentType: "module",
      });

      await apply(createDocument(newDocHandle));
      router.push(`/admin/modules/${newDocHandle.documentId}`);
    });
  };

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Modules"
        description="Manage course modules organized by course"
        actionLabel="New module"
        onAction={handleCreateModule}
        isLoading={isCreating}
      />

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search modules..."
      />

      <Suspense fallback={<ModuleListSkeleton />}>
        <ModuleListContent
          projectId={projectId}
          dataset={dataset}
          onCreateModule={handleCreateModule}
          isCreating={isCreating}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}

export type { ModuleListProps } from "./types";
