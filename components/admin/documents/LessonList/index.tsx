"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useApplyDocumentActions, createDocument } from "@sanity/sdk-react";
import { ListPageHeader, SearchInput } from "@/components/admin/shared";
import { HierarchicalListSkeleton } from "@/components/admin/shared/DocumentSkeleton";
import { LessonListContent } from "./LessonListContent";
import type { LessonListProps } from "./types";

export function LessonList({ projectId, dataset }: LessonListProps) {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const apply = useApplyDocumentActions();

  const handleCreateLesson = () => {
    startTransition(async () => {
      const result = await apply(
        createDocument({
          documentType: "lesson",
        }),
      );
      const created = Array.isArray(result) ? result[0] : result;
      if (created?.id) {
        router.push(`/admin/lessons/${created.id}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="Lessons"
        description="Manage lessons organized by course and module"
        actionLabel="New lesson"
        onAction={handleCreateLesson}
        isLoading={isCreating}
      />

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search lessons..."
      />

      <Suspense fallback={<HierarchicalListSkeleton />}>
        <LessonListContent
          projectId={projectId}
          dataset={dataset}
          onCreateLesson={handleCreateLesson}
          isCreating={isCreating}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}

export type { LessonListProps } from "./types";
