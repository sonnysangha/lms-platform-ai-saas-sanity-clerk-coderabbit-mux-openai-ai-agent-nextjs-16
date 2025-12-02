"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useDocuments } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Tag,
  ArrowRight,
  Plus,
  TrendingUp,
  Zap,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { projectId, dataset } from "@/sanity/env";

interface StatCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  documentType: string;
  href: string;
  gradient: string;
  iconColor: string;
}

function StatCardContent({ documentType }: { documentType: string }) {
  const { data: documents } = useDocuments({
    documentType,
    projectId,
    dataset,
  });

  return (
    <div className="text-3xl font-bold text-white">
      {documents?.length ?? 0}
    </div>
  );
}

function StatCard({
  title,
  icon: Icon,
  documentType,
  href,
  gradient,
  iconColor,
}: StatCardProps) {
  return (
    <Link href={href} className="group">
      <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br ${gradient} shadow-lg`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
        </div>
        <Suspense fallback={<Skeleton className="h-8 w-16 bg-zinc-800" />}>
          <StatCardContent documentType={documentType} />
        </Suspense>
        <p className="text-sm text-zinc-500 mt-1">{title}</p>
      </div>
    </Link>
  );
}

const STAT_CARDS = [
  {
    title: "Courses",
    icon: BookOpen,
    documentType: "course",
    href: "/admin/courses",
    gradient: "from-violet-500 to-fuchsia-600",
    iconColor: "text-white",
  },
  {
    title: "Modules",
    icon: Layers,
    documentType: "module",
    href: "/admin/modules",
    gradient: "from-cyan-500 to-blue-600",
    iconColor: "text-white",
  },
  {
    title: "Lessons",
    icon: PlayCircle,
    documentType: "lesson",
    href: "/admin/lessons",
    gradient: "from-emerald-500 to-teal-600",
    iconColor: "text-white",
  },
  {
    title: "Categories",
    icon: Tag,
    documentType: "category",
    href: "/admin/categories",
    gradient: "from-amber-500 to-orange-600",
    iconColor: "text-white",
  },
];

interface QuickActionLinkProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  gradient: string;
}

function QuickActionLink({
  title,
  description,
  icon: Icon,
  href,
  gradient,
}: QuickActionLinkProps) {
  return (
    <Link
      href={href}
      className="group p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all block"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br ${gradient} shadow-md`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
            {title}
          </p>
          <p className="text-xs text-zinc-500 truncate">{description}</p>
        </div>
        <Plus className="h-4 w-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
      </div>
    </Link>
  );
}

function ContentHealthContent() {
  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
  });
  const { data: modules } = useDocuments({
    documentType: "module",
    projectId,
    dataset,
  });
  const { data: lessons } = useDocuments({
    documentType: "lesson",
    projectId,
    dataset,
  });
  const { data: categories } = useDocuments({
    documentType: "category",
    projectId,
    dataset,
  });

  const checks = [
    {
      label: "Courses created",
      passed: (courses?.length || 0) > 0,
      count: courses?.length || 0,
    },
    {
      label: "Modules created",
      passed: (modules?.length || 0) > 0,
      count: modules?.length || 0,
    },
    {
      label: "Lessons created",
      passed: (lessons?.length || 0) > 0,
      count: lessons?.length || 0,
    },
    {
      label: "Categories created",
      passed: (categories?.length || 0) > 0,
      count: categories?.length || 0,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${(passedCount / checks.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500">
          {passedCount}/{checks.length}
        </span>
      </div>
      <div className="space-y-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2">
            {check.passed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-zinc-600" />
            )}
            <span
              className={`text-sm ${check.passed ? "text-zinc-400" : "text-zinc-600"}`}
            >
              {check.label}
            </span>
            <span className="text-xs text-zinc-600 ml-auto">{check.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your courses, modules, lessons, and categories
          </p>
        </div>
        <Link href="/studio" target="_blank">
          <Button
            variant="outline"
            className="border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Studio
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.documentType} {...card} />
        ))}
      </div>

      {/* Quick Actions & Content Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            <QuickActionLink
              title="Manage Courses"
              description="View and edit courses"
              icon={BookOpen}
              href="/admin/courses"
              gradient="from-violet-500 to-fuchsia-600"
            />
            <QuickActionLink
              title="Manage Modules"
              description="Organize course modules"
              icon={Layers}
              href="/admin/modules"
              gradient="from-cyan-500 to-blue-600"
            />
            <QuickActionLink
              title="Manage Lessons"
              description="Edit lesson content"
              icon={PlayCircle}
              href="/admin/lessons"
              gradient="from-emerald-500 to-teal-600"
            />
            <QuickActionLink
              title="Manage Categories"
              description="Organize your content"
              icon={Tag}
              href="/admin/categories"
              gradient="from-amber-500 to-orange-600"
            />
          </div>
        </div>

        {/* Content Health */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Content Health</h2>
          </div>
          <div className="rounded-xl bg-zinc-900/30 border border-zinc-800 p-4">
            <Suspense
              fallback={
                <div className="space-y-3">
                  <Skeleton className="h-2 w-full bg-zinc-800 rounded" />
                  {["check-1", "check-2", "check-3", "check-4"].map((id) => (
                    <div key={id} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 bg-zinc-800 rounded" />
                      <Skeleton className="h-4 w-32 bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>
              }
            >
              <ContentHealthContent />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="rounded-xl bg-linear-to-br from-violet-600/10 via-fuchsia-600/5 to-cyan-600/10 border border-violet-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600 shadow-lg shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Pro Tips for Content Creation
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span>
                  Start by creating{" "}
                  <strong className="text-zinc-300">Categories</strong> to
                  organize your courses by topic
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span>
                  Build <strong className="text-zinc-300">Lessons</strong>{" "}
                  first, then group them into{" "}
                  <strong className="text-zinc-300">Modules</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span>
                  Finally, create a{" "}
                  <strong className="text-zinc-300">Course</strong> and add your
                  modules to it
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span>
                  Use the <strong className="text-zinc-300">tier system</strong>{" "}
                  (Free, Pro, Ultra) to control access
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
