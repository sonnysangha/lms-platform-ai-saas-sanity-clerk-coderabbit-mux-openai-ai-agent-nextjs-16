"use client";

import { Suspense, useState } from "react";
import { useDocument, useEditDocument, useDocuments } from "@sanity/sdk-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion } from "@/components/ui/accordion";
import { Plus, GripVertical } from "lucide-react";
import { ModuleAccordionItemContent } from "./ModuleAccordionItemContent";
import { ModuleOptionLabel } from "./OptionLabels";
import type { ModuleAccordionInputProps, SanityReference } from "./types";

function ModuleAccordionInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-24 w-full bg-zinc-800" />
    </div>
  );
}

function ModuleAccordionInputField({
  path,
  label,
  projectId,
  dataset,
  ...handle
}: ModuleAccordionInputProps) {
  const [selectedModuleToAdd, setSelectedModuleToAdd] = useState<string>("");
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  // Get current module reference array
  const { data: currentModules } = useDocument({
    ...handle,
    projectId,
    dataset,
    path,
  });
  const editModules = useEditDocument({
    ...handle,
    projectId,
    dataset,
    path,
  });

  // Fetch all modules
  const { data: availableModules } = useDocuments({
    documentType: "module",
    projectId,
    dataset,
  });

  const modules = (currentModules as SanityReference[]) ?? [];
  const currentModuleIds = new Set(modules.map((m) => m._ref));

  // Filter out already-added modules
  const availableToAdd = availableModules?.filter(
    (doc) => !currentModuleIds.has(doc.documentId),
  );

  // Module drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex(
        (m) => m._key === active.id || m._ref === active.id,
      );
      const newIndex = modules.findIndex(
        (m) => m._key === over.id || m._ref === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newModules = arrayMove(modules, oldIndex, newIndex);
        editModules(newModules as SanityReference[]);
      }
    }
  };

  const handleAddModule = () => {
    if (!selectedModuleToAdd) return;

    const newModule: SanityReference = {
      _type: "reference",
      _ref: selectedModuleToAdd,
      _key: crypto.randomUUID(),
    };

    editModules([...modules, newModule] as SanityReference[]);
    setSelectedModuleToAdd("");
    // Auto-expand newly added module
    setOpenAccordions((prev) => [...prev, newModule._key]);
  };

  const handleRemoveModule = (moduleRef: string) => {
    editModules(
      modules.filter((m) => m._ref !== moduleRef) as SanityReference[],
    );
  };

  const moduleSortableIds = modules.map((m) => m._key ?? m._ref);

  return (
    <div className="space-y-3">
      <Label className="text-zinc-300">{label}</Label>

      {/* Modules accordion list with drag-and-drop */}
      {modules.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleModuleDragEnd}
        >
          <SortableContext
            items={moduleSortableIds}
            strategy={verticalListSortingStrategy}
          >
            <Accordion
              type="multiple"
              value={openAccordions}
              onValueChange={setOpenAccordions}
            >
              {modules.map((module) => {
                const moduleId = module._key ?? module._ref;
                return (
                  <Suspense
                    key={moduleId}
                    fallback={
                      <div className="flex items-center gap-2 p-3 border border-zinc-700 rounded-lg mb-2 bg-zinc-800/30">
                        <GripVertical className="h-4 w-4 text-zinc-500" />
                        <Skeleton className="h-4 w-32 flex-1 bg-zinc-700" />
                      </div>
                    }
                  >
                    <ModuleAccordionItemContent
                      id={moduleId}
                      moduleId={module._ref}
                      projectId={projectId}
                      dataset={dataset}
                      onRemoveModule={() => handleRemoveModule(module._ref)}
                    />
                  </Suspense>
                );
              })}
            </Accordion>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-sm text-zinc-500 py-2">No modules added yet</p>
      )}

      {/* Add new module */}
      {availableToAdd && availableToAdd.length > 0 && (
        <div className="flex gap-2">
          <Select
            value={selectedModuleToAdd}
            onValueChange={setSelectedModuleToAdd}
          >
            <SelectTrigger className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300">
              <SelectValue placeholder="Add module..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {availableToAdd.map((doc) => (
                <SelectItem
                  key={doc.documentId}
                  value={doc.documentId}
                  className="text-zinc-300 focus:bg-zinc-700 focus:text-white"
                >
                  <Suspense fallback={doc.documentId}>
                    <ModuleOptionLabel {...doc} />
                  </Suspense>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddModule}
            disabled={!selectedModuleToAdd}
            size="icon"
            className="bg-violet-600 hover:bg-violet-500 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ModuleAccordionInput(props: ModuleAccordionInputProps) {
  return (
    <Suspense fallback={<ModuleAccordionInputFallback label={props.label} />}>
      <ModuleAccordionInputField {...props} />
    </Suspense>
  );
}

export type { ModuleAccordionInputProps } from "./types";
