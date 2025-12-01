import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Play, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIER_STYLES, type Tier } from "@/lib/constants";

interface CourseHeroProps {
  title: string | null;
  description: string | null;
  tier: Tier | null;
  thumbnail?: {
    asset?: {
      url: string | null;
    } | null;
  } | null;
  category?: {
    title: string | null;
  } | null;
  moduleCount?: number | null;
  lessonCount?: number | null;
}

export function CourseHero({
  title,
  description,
  tier,
  thumbnail,
  category,
  moduleCount,
  lessonCount,
}: CourseHeroProps) {
  const displayTier = tier ?? "free";
  const styles = TIER_STYLES[displayTier];

  return (
    <div className="mb-12">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Thumbnail */}
        <div
          className={`relative w-full lg:w-80 h-48 lg:h-52 rounded-2xl bg-gradient-to-br ${styles.gradient} flex items-center justify-center overflow-hidden shrink-0`}
        >
          {thumbnail?.asset?.url ? (
            <Image
              src={thumbnail.asset.url}
              alt={title ?? "Course thumbnail"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-7xl opacity-50">📚</div>
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Course Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className={`${styles.text} ${styles.border} bg-transparent`}>
              {displayTier.toUpperCase()}
            </Badge>
            {category?.title && (
              <Badge
                variant="outline"
                className="border-zinc-700 text-zinc-400"
              >
                <Tag className="w-3 h-3 mr-1" />
                {category.title}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-white">
            {title ?? "Untitled Course"}
          </h1>

          {description && (
            <p className="text-lg text-zinc-400 mb-6 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {moduleCount ?? 0} modules
            </span>
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {lessonCount ?? 0} lessons
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

