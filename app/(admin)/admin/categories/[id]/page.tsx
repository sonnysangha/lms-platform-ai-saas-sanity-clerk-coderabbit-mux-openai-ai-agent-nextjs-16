"use client";

import { use } from "react";
import { CategoryEditor } from "@/components/admin/editors/CategoryEditor";
import { projectId, dataset } from "@/sanity/env";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <CategoryEditor documentId={id} projectId={projectId} dataset={dataset} />;
}
