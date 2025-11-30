"use client";

import { DocumentList } from "@/components/admin/documents/DocumentList";
import { projectId, dataset } from "@/sanity/env";

export default function ModulesPage() {
  return (
    <DocumentList
      documentType="module"
      title="Modules"
      description="Manage course modules and their lessons"
      basePath="/admin/modules"
      projectId={projectId}
      dataset={dataset}
    />
  );
}

