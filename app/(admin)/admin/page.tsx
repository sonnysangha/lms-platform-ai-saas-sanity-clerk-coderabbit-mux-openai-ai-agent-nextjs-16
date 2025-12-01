"use client";

import { Suspense, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useDocuments,
  useApplyDocumentActions,
  createDocument,
} from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Tag,
  ArrowRight,
  Plus,
  Loader2,
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
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}
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

const QUICK_ACTIONS = [
  {
    documentType: "course",
    basePath: "/admin/courses",
    label: "Create Course",
    icon: BookOpen,
    color: "text-violet-400",
  },
  {
    documentType: "module",
    basePath: "/admin/modules",
    label: "Create Module",
    icon: Layers,
    color: "text-cyan-400",
  },
  {
    documentType: "lesson",
    basePath: "/admin/lessons",
    label: "Create Lesson",
    icon: PlayCircle,
    color: "text-emerald-400",
  },
  {
    documentType: "category",
    basePath: "/admin/categories",
    label: "Create Category",
    icon: Tag,
    color: "text-amber-400",
  },
];

function QuickActionButton({
  documentType,
  basePath,
  label,
  icon: Icon,
  color,
}: (typeof QUICK_ACTIONS)[number]) {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const apply = useApplyDocumentActions();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await apply(
        createDocument({
          documentType,
        }),
      );
      const created = Array.isArray(result) ? result[0] : result;
      if (created?.id) {
        router.push(`${basePath}/${created.id}`);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleCreate}
      disabled={isCreating}
      className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group text-left w-full disabled:opacity-50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
          {isCreating ? "Creating..." : label}
        </span>
        {isCreating ? (
          <Loader2 className="h-4 w-4 text-zinc-400 ml-auto animate-spin" />
        ) : (
          <Plus className="h-4 w-4 text-zinc-600 ml-auto group-hover:text-zinc-400 transition-colors" />
        )}
      </div>
    </button>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">
          Manage your courses, modules, lessons, and categories
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.documentType} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionButton key={action.documentType} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
}
