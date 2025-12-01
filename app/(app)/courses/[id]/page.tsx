import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/Header";
import {
  CourseHero,
  ModuleAccordion,
  CourseCompleteButton,
  GatedFallback,
} from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { COURSE_WITH_MODULES_QUERY } from "@/sanity/lib/queries";
import { hasAccessToTier } from "@/lib/course-access";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: course } = await sanityFetch({
    query: COURSE_WITH_MODULES_QUERY,
    params: { id, userId: userId ?? "" },
  });

  if (!course) {
    notFound();
  }

  const hasAccess = await hasAccessToTier(course.tier);

  // Stats from GROQ query
  const totalLessons = course.lessonCount ?? 0;
  const completedLessons = course.completedLessonCount ?? 0;
  const isCourseCompleted = userId
    ? (course.completedBy?.includes(userId) ?? false)
    : false;

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
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <CourseHero
          title={course.title}
          description={course.description}
          tier={course.tier}
          thumbnail={course.thumbnail}
          category={course.category}
          moduleCount={course.moduleCount}
          lessonCount={course.lessonCount}
        />

        {hasAccess ? (
          <div className="space-y-8">
            {/* Course completion progress */}
            {userId && (
              <CourseCompleteButton
                courseId={course._id}
                isCompleted={isCourseCompleted}
                completedLessons={completedLessons}
                totalLessons={totalLessons}
              />
            )}

            <ModuleAccordion
              modules={course.modules}
              userId={userId}
              courseId={course._id}
            />
          </div>
        ) : (
          <GatedFallback requiredTier={course.tier} />
        )}
      </main>
    </div>
  );
}
