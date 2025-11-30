"use client";

import { DocumentList } from "@/components/admin/documents/DocumentList";
import { projectId, dataset } from "@/sanity/env";

export default function CoursesPage() {
  return (
    <DocumentList
      documentType="course"
      title="Courses"
      description="Manage your courses and their content"
      basePath="/admin/courses"
      projectId={projectId}
      dataset={dataset}
    />
  );
}
