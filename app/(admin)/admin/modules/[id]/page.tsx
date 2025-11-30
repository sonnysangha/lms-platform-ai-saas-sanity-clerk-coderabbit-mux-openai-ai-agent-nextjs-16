"use client";

import { use } from "react";
import { ModuleEditor } from "@/components/admin/editors/ModuleEditor";
import { projectId, dataset } from "@/sanity/env";

export default function EditModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ModuleEditor documentId={id} projectId={projectId} dataset={dataset} />;
}
