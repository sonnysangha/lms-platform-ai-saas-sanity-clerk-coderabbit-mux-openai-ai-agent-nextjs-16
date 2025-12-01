"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectInputProps extends DocumentHandle {
  path: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
}

function SelectInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-10 w-full bg-zinc-800" />
    </div>
  );
}

function SelectInputField({
  path,
  label,
  options,
  placeholder,
  ...handle
}: SelectInputProps) {
  const { data: value } = useDocument({ ...handle, path });
  const editValue = useEditDocument({ ...handle, path });

  // Use RadioGroup for 4 or fewer options (per Sanity schema best practices)
  if (options.length <= 4) {
    return (
      <div className="space-y-3">
        <Label className="text-zinc-300">{label}</Label>
        <RadioGroup
          value={(value as string) ?? ""}
          onValueChange={(newValue) => editValue(newValue)}
          className="flex flex-wrap gap-4"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${path}-${option.value}`}
                className="border-zinc-600 text-violet-500"
              />
              <Label
                htmlFor={`${path}-${option.value}`}
                className="font-normal cursor-pointer text-zinc-300"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // Use Select dropdown for more than 4 options
  return (
    <div className="space-y-2">
      <Label htmlFor={path} className="text-zinc-300">{label}</Label>
      <Select
        value={(value as string) ?? ""}
        onValueChange={(newValue) => editValue(newValue)}
      >
        <SelectTrigger id={path} className="bg-zinc-800/50 border-zinc-700 text-zinc-300">
          <SelectValue placeholder={placeholder ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-zinc-300 focus:bg-zinc-700 focus:text-white">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SelectInput(props: SelectInputProps) {
  return (
    <Suspense fallback={<SelectInputFallback label={props.label} />}>
      <SelectInputField {...props} />
    </Suspense>
  );
}
