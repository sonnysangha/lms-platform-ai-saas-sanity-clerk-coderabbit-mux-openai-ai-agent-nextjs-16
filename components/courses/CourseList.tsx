"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseCard, type CourseCardProps } from "./CourseCard";
import { TierFilterTabs, type TierFilter } from "./TierFilterTabs";
import type { Tier } from "@/lib/constants";

export interface CourseListCourse {
  _id: string;
  title: string | null;
  description?: string | null;
  tier: Tier | null;
  thumbnail?: {
    asset?: {
      url: string | null;
    } | null;
  } | null;
  moduleCount?: number | null;
  lessonCount?: number | null;
}

interface CourseListProps {
  courses: CourseListCourse[];
  showFilters?: boolean;
  showSearch?: boolean;
  emptyMessage?: string;
  userTier?: Tier | null;
}

export function CourseList({
  courses,
  showFilters = true,
  showSearch = true,
  emptyMessage = "No courses found",
  userTier = "free",
}: CourseListProps) {
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses based on tier and search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Tier filter
      if (tierFilter !== "all" && course.tier !== tierFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = course.title?.toLowerCase() ?? "";
        const description = course.description?.toLowerCase() ?? "";
        if (!title.includes(query) && !description.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [courses, tierFilter, searchQuery]);

  // Determine if a course is locked based on user tier
  const isCourseLocked = (courseTier: Tier | null): boolean => {
    if (!courseTier || courseTier === "free") return false;
    if (!userTier) return true; // No user tier means they can only access free content

    const tierHierarchy: Record<Tier, number> = {
      free: 0,
      pro: 1,
      ultra: 2,
    };

    return tierHierarchy[courseTier] > tierHierarchy[userTier];
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      {(showFilters || showSearch) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {showFilters && (
            <TierFilterTabs
              activeFilter={tierFilter}
              onFilterChange={setTierFilter}
            />
          )}

          {showSearch && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              id={course._id}
              title={course.title}
              description={course.description}
              tier={course.tier}
              thumbnail={course.thumbnail}
              moduleCount={course.moduleCount}
              lessonCount={course.lessonCount}
              isLocked={isCourseLocked(course.tier)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-zinc-400">{emptyMessage}</p>
          {(tierFilter !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setTierFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

