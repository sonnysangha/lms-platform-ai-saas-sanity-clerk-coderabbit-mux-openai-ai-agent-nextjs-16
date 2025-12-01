"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useDocuments,
  useDocumentProjection,
  useApplyDocumentActions,
  createDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Plus, Loader2, Search, X } from "lucide-react";
import { projectId, dataset } from "@/sanity/env";
import { CourseCard } from "@/components/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface CourseData {
  title?: string;
  description?: string;
  tier?: "free" | "pro" | "ultra";
  thumbnail?: {
    asset?: {
      url?: string;
    };
  };
  moduleCount?: number;
  lessonCount?: number;
}

function CourseCardFallback() {
  return (
    <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
      <Skeleton className="h-36 w-full bg-zinc-800" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-zinc-800" />
        <Skeleton className="h-4 w-full bg-zinc-800" />
        <Skeleton className="h-4 w-1/2 bg-zinc-800" />
      </div>
    </div>
  );
}

function AdminCourseItem({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      description,
      tier,
      "thumbnail": thumbnail.asset->{ url },
      "moduleCount": count(modules),
      "lessonCount": count(modules[]->lessons[])
    }`,
  });

  const course = data as CourseData | undefined;

  return (
    <CourseCard
      href={`/admin/courses/${documentId}`}
      title={course?.title ?? null}
      description={course?.description ?? null}
      tier={course?.tier ?? null}
      thumbnail={
        course?.thumbnail
          ? { asset: { _id: "", url: course.thumbnail.asset?.url ?? null } }
          : null
      }
      moduleCount={course?.moduleCount ?? null}
      lessonCount={course?.lessonCount ?? null}
    />
  );
}

function CourseGrid({
  onCreateCourse,
  isCreating,
  searchQuery,
}: {
  onCreateCourse: () => void;
  isCreating: boolean;
  searchQuery: string;
}) {
  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
    search: searchQuery || undefined,
  });

  if (!courses || courses.length === 0) {
    return (
      <div className="p-12 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-zinc-400 mb-4">No courses found</p>
        <button
          type="button"
          onClick={onCreateCourse}
          disabled={isCreating}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 rounded-lg shadow-lg shadow-violet-500/20 transition-all"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isCreating ? "Creating..." : "Create your first course"}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <Suspense key={course.documentId} fallback={<CourseCardFallback />}>
          <AdminCourseItem {...course} />
        </Suspense>
      ))}
    </div>
  );
}

function CourseGridFallback() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <CourseCardFallback key={i} />
      ))}
    </div>
  );
}

export default function CoursesPage() {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const apply = useApplyDocumentActions();

  const handleCreateCourse = () => {
    startTransition(async () => {
      const result = await apply(
        createDocument({
          documentType: "course",
        }),
      );
      // Navigate to edit the new course
      const created = Array.isArray(result) ? result[0] : result;
      if (created?.id) {
        router.push(`/admin/courses/${created.id}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Courses
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your courses and their content
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateCourse}
          disabled={isCreating}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 rounded-lg shadow-lg shadow-violet-500/20 transition-all"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isCreating ? "Creating..." : "New course"}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Suspense fallback={<CourseGridFallback />}>
        <CourseGrid
          onCreateCourse={handleCreateCourse}
          isCreating={isCreating}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}
