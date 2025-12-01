"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Play, Layers, CheckCircle2 } from "lucide-react";
import { TIER_STYLES } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import type { DASHBOARD_COURSES_QUERYResult } from "@/sanity.types";

// Infer Sanity course fields from query result
type SanityCourse = DASHBOARD_COURSES_QUERYResult[number];

export interface CourseCardProps
  extends Pick<
    SanityCourse,
    | "title"
    | "description"
    | "tier"
    | "thumbnail"
    | "moduleCount"
    | "lessonCount"
  > {
  slug?: { current: string } | null;
  href?: string;
  completedLessonCount?: number | null;
  isCompleted?: boolean;
  isLocked?: boolean;
  showProgress?: boolean;
}

export function CourseCard({
  slug,
  href,
  title,
  description,
  tier,
  thumbnail,
  moduleCount,
  lessonCount,
  completedLessonCount = 0,
  isCompleted = false,
  isLocked = false,
  showProgress = false,
}: CourseCardProps) {
  const displayTier = tier ?? "free";
  const styles = TIER_STYLES[displayTier];
  const totalLessons = lessonCount ?? 0;
  const completed = completedLessonCount ?? 0;
  const progressPercent =
    totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  const linkHref = href ?? `/courses/${slug?.current ?? ""}`;

  return (
    <Link href={linkHref} className="group block">
      <div className="relative rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
        {/* Course thumbnail/header */}
        <div
          className={`h-36 bg-gradient-to-br ${styles.gradient} flex items-center justify-center relative overflow-hidden`}
        >
          {thumbnail?.asset?.url ? (
            <Image
              src={thumbnail.asset.url}
              alt={title ?? "Course thumbnail"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-6xl opacity-50">📚</div>
          )}
          <div className="absolute inset-0 bg-black/20" />

          {/* Tier badge or Completed badge */}
          {isCompleted ? (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 text-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </div>
          ) : (
            <div
              className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${styles.badge}`}
            >
              {displayTier}
            </div>
          )}

          {/* Locked overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <span className="text-xs text-zinc-400 font-medium">
                  Upgrade to unlock
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Course content */}
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 text-white group-hover:text-violet-400 transition-colors line-clamp-2">
            {title ?? "Untitled Course"}
          </h3>

          {description && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              {moduleCount ?? 0} modules
            </span>
            <span className="flex items-center gap-1.5">
              <Play className="w-4 h-4" />
              {lessonCount ?? 0} lessons
            </span>
          </div>

          {/* Progress bar */}
          {showProgress && totalLessons > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">
                  {completed}/{totalLessons} lessons
                </span>
                <span className="text-zinc-500">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-2 bg-zinc-800 [&>div]:bg-emerald-500"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
