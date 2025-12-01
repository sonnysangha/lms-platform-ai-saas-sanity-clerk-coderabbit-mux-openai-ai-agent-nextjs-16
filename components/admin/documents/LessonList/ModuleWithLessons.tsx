"use client";

import { Suspense } from "react";
import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonItem } from "./LessonItem";
import type { ModuleLessonsData } from "./types";

export function ModuleWithLessons({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      lessons[]{ _ref }
    }`,
  });

  const module = data as ModuleLessonsData | undefined;
  const lessonRefs = module?.lessons ?? [];

  if (lessonRefs.length === 0) return null;

  return (
    <AccordionItem
      value={documentId}
      className="border-l-2 border-zinc-700 pl-4 ml-2"
    >
      <AccordionTrigger className="py-2 hover:no-underline transition-colors [&[data-state=open]]:text-violet-400">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-violet-400" />
          <span className="font-medium text-sm text-zinc-300">
            {module?.title || "Untitled Module"}
          </span>
          <span className="text-xs text-zinc-500">
            ({lessonRefs.length} lesson{lessonRefs.length === 1 ? "" : "s"})
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="space-y-1.5 pt-1">
          {lessonRefs.map((ref, index) =>
            ref._ref ? (
              <Suspense
                key={ref._ref}
                fallback={<Skeleton className="h-12 w-full bg-zinc-800/50" />}
              >
                <div className="py-0.5">
                  <LessonItem
                    documentId={ref._ref}
                    documentType="lesson"
                    projectId={projectId}
                    dataset={dataset}
                    index={index}
                  />
                </div>
              </Suspense>
            ) : null,
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
