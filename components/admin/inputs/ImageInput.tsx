"use client";

import { Suspense } from "react";
import { useDocument, type DocumentHandle } from "@sanity/sdk-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

interface ImageInputProps extends DocumentHandle {
  path: string;
  label: string;
}

interface SanityImageAsset {
  _type: "image";
  asset?: {
    _type: "reference";
    _ref: string;
  };
}

function ImageInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-32 w-full bg-zinc-800" />
    </div>
  );
}

function ImageInputField({ path, label, ...handle }: ImageInputProps) {
  const { data: imageData } = useDocument({ ...handle, path });

  const image = imageData as SanityImageAsset | null;
  const hasImage = image?.asset?._ref;

  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <div className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/30">
        {hasImage ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <ImageIcon className="h-4 w-4" />
              <span>Image uploaded</span>
            </div>
            <p className="text-xs text-zinc-500 break-all">
              Asset: {image.asset?._ref}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-zinc-500">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm">No image uploaded</p>
            <p className="text-xs mt-1">
              Image upload coming soon - use Sanity Studio for now
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ImageInput(props: ImageInputProps) {
  return (
    <Suspense fallback={<ImageInputFallback label={props.label} />}>
      <ImageInputField {...props} />
    </Suspense>
  );
}
