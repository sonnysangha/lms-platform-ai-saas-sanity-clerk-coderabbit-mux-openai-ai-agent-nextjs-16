"use client";

import Link from "next/link";
import { Play, CheckCircle2, Circle, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  _id: string;
  title: string | null;
  description?: string | null;
  completedBy?: string[] | null;
  video?: {
    asset?: {
      playbackId?: string | null;
    } | null;
  } | null;
}

interface Module {
  _id: string;
  title: string | null;
  description?: string | null;
  completedBy?: string[] | null;
  lessons?: Lesson[] | null;
}

interface ModuleAccordionProps {
  modules: Module[] | null;
  userId?: string | null;
  courseId: string;
}

export function ModuleAccordion({
  modules,
  userId,
  courseId,
}: ModuleAccordionProps) {
  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No modules available yet.</p>
      </div>
    );
  }

  const isLessonCompleted = (lesson: Lesson): boolean => {
    if (!userId || !lesson.completedBy) return false;
    return lesson.completedBy.includes(userId);
  };

  const getModuleProgress = (
    module: Module,
  ): { completed: number; total: number } => {
    const lessons = module.lessons ?? [];
    const total = lessons.length;
    const completed = lessons.filter((lesson) =>
      isLessonCompleted(lesson),
    ).length;
    return { completed, total };
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Course Content</h2>

      <Accordion type="multiple" className="space-y-3">
        {modules.map((module, index) => {
          const { completed, total } = getModuleProgress(module);
          const isModuleComplete = total > 0 && completed === total;

          return (
            <AccordionItem
              key={module._id}
              value={module._id}
              className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 data-[state=open]:bg-zinc-900/80"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-semibold text-white">
                      {module.title ?? "Untitled Module"}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {total} {total === 1 ? "lesson" : "lessons"}
                      {userId && total > 0 && (
                        <span className="ml-2">
                          • {completed}/{total} completed
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Progress bar */}
                  {userId && total > 0 && (
                    <div className="hidden sm:flex items-center gap-3 shrink-0 w-36">
                      <Progress
                        value={(completed / total) * 100}
                        className="flex-1 h-2 bg-zinc-700 [&>div]:bg-emerald-500"
                      />
                      <div className="w-5">
                        {isModuleComplete && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-4">
                <div className="space-y-1 ml-12">
                  {module.lessons?.map((lesson) => {
                    const completed = isLessonCompleted(lesson);
                    const hasVideo = !!lesson.video?.asset?.playbackId;

                    return (
                      <Link
                        key={lesson._id}
                        href={`/lessons/${lesson._id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                      >
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                        )}

                        <span
                          className={`flex-1 text-sm ${
                            completed ? "text-zinc-400" : "text-zinc-300"
                          } group-hover:text-white transition-colors`}
                        >
                          {lesson.title ?? "Untitled Lesson"}
                        </span>

                        {hasVideo && (
                          <Play className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
