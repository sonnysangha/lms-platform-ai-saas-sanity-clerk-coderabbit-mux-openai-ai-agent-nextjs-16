import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { GatedFallback } from "@/components/courses/GatedFallback";
import {
  MuxVideoPlayer,
  LessonContent,
  LessonCompleteButton,
  LessonSidebar,
} from "@/components/lessons";
import { sanityFetch } from "@/sanity/lib/live";
import { LESSON_BY_ID_QUERY } from "@/sanity/lib/queries";
import { hasAccessToTier } from "@/lib/course-access";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: lesson } = await sanityFetch({
    query: LESSON_BY_ID_QUERY,
    params: { id },
  });

  if (!lesson) {
    notFound();
  }

  // Check access based on parent course tier
  const courseTier = lesson.course?.tier;
  const hasAccess = await hasAccessToTier(courseTier);

  console.log("lesson.course", lesson.course);
  console.log("hasAccess", hasAccess);

  // Check if user has completed this lesson
  const isCompleted = userId
    ? (lesson.completedBy?.includes(userId) ?? false)
    : false;

  // Find previous and next lessons for navigation
  const { prevLesson, nextLesson, completedLessonIds } = findAdjacentLessons(
    lesson.course?.modules,
    id,
    userId,
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {lesson.course && hasAccess && (
            <LessonSidebar
              courseId={lesson.course._id}
              courseTitle={lesson.course.title}
              modules={lesson.course.modules}
              currentLessonId={id}
              completedLessonIds={completedLessonIds}
            />
          )}

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {hasAccess ? (
              <>
                {/* Video Player */}
                <MuxVideoPlayer
                  playbackId={lesson.video?.asset?.playbackId}
                  title={lesson.title ?? undefined}
                  className="mb-6"
                />

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
                        <span className="hidden sm:inline">
                          {prevLesson.title}
                        </span>
                        <span className="sm:hidden">Previous</span>
                      </Button>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextLesson ? (
                    <Link href={`/lessons/${nextLesson.id}`}>
                      <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                        <span className="hidden sm:inline">
                          {nextLesson.title}
                        </span>
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
      </main>
    </div>
  );
}

// Helper to find previous and next lessons and completed lesson IDs
function findAdjacentLessons(
  modules:
    | Array<{
        _id: string;
        title: string | null;
        lessons: Array<{
          _id: string;
          title: string | null;
          completedBy?: string[] | null;
        }> | null;
      }>
    | null
    | undefined,
  currentLessonId: string,
  userId: string | null,
): {
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
  completedLessonIds: string[];
} {
  if (!modules)
    return { prevLesson: null, nextLesson: null, completedLessonIds: [] };

  // Flatten all lessons and track completed ones
  const allLessons: Array<{ id: string; title: string }> = [];
  const completedLessonIds: string[] = [];

  for (const module of modules) {
    if (module.lessons) {
      for (const lesson of module.lessons) {
        allLessons.push({
          id: lesson._id,
          title: lesson.title ?? "Untitled Lesson",
        });
        if (userId && lesson.completedBy?.includes(userId)) {
          completedLessonIds.push(lesson._id);
        }
      }
    }
  }

  // Find current index
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);

  return {
    prevLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
    nextLesson:
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null,
    completedLessonIds,
  };
}
