"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Tier } from "@/lib/constants";

export type TierFilter = Tier | "all";

interface TierFilterTabsProps {
  activeFilter: TierFilter;
  onFilterChange: (filter: TierFilter) => void;
  className?: string;
}

const FILTER_OPTIONS: { value: TierFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "ultra", label: "Ultra" },
];

export function TierFilterTabs({
  activeFilter,
  onFilterChange,
  className,
}: TierFilterTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-900/50 border border-zinc-800",
        className
      )}
    >
      {FILTER_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange(option.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            activeFilter === option.value
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-500"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

