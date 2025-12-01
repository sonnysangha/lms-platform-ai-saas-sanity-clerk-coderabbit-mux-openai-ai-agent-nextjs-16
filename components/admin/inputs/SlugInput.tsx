"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

interface SlugValue {
  _type: "slug";
  current: string;
}

interface SlugInputProps extends DocumentHandle {
  path: string;
  label: string;
  sourceField?: string;
  placeholder?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function SlugInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-10 w-full bg-zinc-800" />
    </div>
  );
}

function SlugInputField({
  path,
  label,
  sourceField = "title",
  placeholder = "enter-slug-here",
  ...handle
}: SlugInputProps) {
  const { data: slugValue } = useDocument<SlugValue>({ ...handle, path });
  const { data: sourceValue } = useDocument<string>({
    ...handle,
    path: sourceField,
  });
  const editSlug = useEditDocument<SlugValue>({ ...handle, path });

  const currentSlug = slugValue?.current ?? "";

  const handleChange = (value: string) => {
    editSlug({
      _type: "slug",
      current: slugify(value),
    });
  };

  const generateFromSource = () => {
    if (sourceValue) {
      editSlug({
        _type: "slug",
        current: slugify(sourceValue),
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={path} className="text-zinc-300">{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
            /
          </span>
          <Input
            id={path}
            type="text"
            value={currentSlug}
            onChange={(e) => handleChange(e.currentTarget.value)}
            placeholder={placeholder}
            className="pl-6 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateFromSource}
          title="Generate from title"
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-zinc-500">
        URL-friendly identifier for this content
      </p>
    </div>
  );
}

export function SlugInput(props: SlugInputProps) {
  return (
    <Suspense fallback={<SlugInputFallback label={props.label} />}>
      <SlugInputField {...props} />
    </Suspense>
  );
}
