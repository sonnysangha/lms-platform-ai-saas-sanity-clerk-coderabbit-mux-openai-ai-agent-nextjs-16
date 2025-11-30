"use client";

import { use } from "react";
import { LessonEditor } from "@/components/admin/editors/LessonEditor";
import { projectId, dataset } from "@/sanity/env";

export default function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <LessonEditor documentId={id} projectId={projectId} dataset={dataset} />
  );
}
