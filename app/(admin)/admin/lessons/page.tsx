"use client";

import { DocumentList } from "@/components/admin/documents/DocumentList";
import { projectId, dataset } from "@/sanity/env";

export default function LessonsPage() {
  return (
    <DocumentList
      documentType="lesson"
      title="Lessons"
      description="Manage individual lessons and their content"
      basePath="/admin/lessons"
      projectId={projectId}
      dataset={dataset}
    />
  );
}
