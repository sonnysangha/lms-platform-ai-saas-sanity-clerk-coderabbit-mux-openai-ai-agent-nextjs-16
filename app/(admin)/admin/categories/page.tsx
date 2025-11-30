"use client";

import { DocumentList } from "@/components/admin/documents/DocumentList";
import { projectId, dataset } from "@/sanity/env";

export default function CategoriesPage() {
  return (
    <DocumentList
      documentType="category"
      title="Categories"
      description="Organize courses by category"
      basePath="/admin/categories"
      projectId={projectId}
      dataset={dataset}
    />
  );
}

