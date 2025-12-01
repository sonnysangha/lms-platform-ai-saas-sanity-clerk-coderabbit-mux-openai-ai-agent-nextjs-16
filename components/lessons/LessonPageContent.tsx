"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GatedFallback } from "@/components/courses/GatedFallback";
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier";
import { MuxVideoPlayer } from "./MuxVideoPlayer";
import { LessonContent } from "./LessonContent";
import { LessonCompleteButton } from "./LessonCompleteButton";
import { LessonSidebar } from "./LessonSidebar";
import type { LESSON_BY_ID_QUERYResult } from "@/sanity.types";

interface LessonPageContentProps {
  lesson: NonNullable<LESSON_BY_ID_QUERYResult>;
  userId: string | null;
}

export function LessonPageContent({ lesson, userId }: LessonPageContentProps) {
  const userTier = useUserTier();

  // Check if user has access based on course tier
  const courseTier = lesson.course?.tier;
  const hasAccess = hasTierAccess(userTier, courseTier);

  // Check if user has completed this lesson
  const isCompleted = useMemo(() => {
    return userId ? (lesson.completedBy?.includes(userId) ?? false) : false;
  }, [lesson.completedBy, userId]);

  // Find previous and next lessons for navigation
  const { prevLesson, nextLesson, completedLessonIds } = useMemo(() => {
    const modules = lesson.course?.modules;
    if (!modules)
      return { prevLesson: null, nextLesson: null, completedLessonIds: [] };

    // Flatten all lessons and track completed ones
    const allLessons: Array<{ id: string; title: string }> = [];
    const completed: string[] = [];

    for (const module of modules) {
      if (module.lessons) {
        for (const l of module.lessons) {
          allLessons.push({
            id: l._id,
            title: l.title ?? "Untitled Lesson",
          });
          if (userId && l.completedBy?.includes(userId)) {
            completed.push(l._id);
          }
        }
      }
    }

    // Find current index
    const currentIndex = allLessons.findIndex((l) => l.id === lesson._id);

    return {
      prevLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      nextLesson:
        currentIndex < allLessons.length - 1
          ? allLessons[currentIndex + 1]
          : null,
      completedLessonIds: completed,
    };
  }, [lesson.course?.modules, lesson._id, userId]);

  console.log(lesson.video);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      {lesson.course && hasAccess && (
        <LessonSidebar
          courseId={lesson.course._id}
          courseTitle={lesson.course.title}
          modules={lesson.course.modules ?? null}
          currentLessonId={lesson._id}
          completedLessonIds={completedLessonIds}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {hasAccess ? (
          <>
            {/* Video Player */}
            {lesson.video?.asset?.playbackId && (
              <MuxVideoPlayer
                playbackId={lesson.video?.asset?.playbackId}
                title={lesson.title ?? undefined}
                className="mb-6"
              />
            )}

            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {lesson.title ?? "Untitled Lesson"}
                </h1>
                {lesson.description && (
                  <p className="text-zinc-400">{lesson.description}</p>
                )}
              </div>

              {userId && (
                <LessonCompleteButton
                  lessonId={lesson._id}
                  isCompleted={isCompleted}
                />
              )}
            </div>

            {/* Lesson Content */}
            {lesson.content && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-semibold">Lesson Notes</h2>
                </div>
                <LessonContent content={lesson.content} />
              </div>
            )}

            {/* Navigation between lessons */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.id}`}>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{prevLesson.title}</span>
                    <span className="sm:hidden">Previous</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.id}`}>
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                    <span className="hidden sm:inline">{nextLesson.title}</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </>
        ) : (
          <GatedFallback requiredTier={courseTier} />
        )}
      </div>
    </div>
  );
}
