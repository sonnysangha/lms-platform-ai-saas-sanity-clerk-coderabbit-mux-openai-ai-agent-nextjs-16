"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useDocuments } from "@sanity/sdk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Layers, PlayCircle, Tag, ArrowRight } from "lucide-react";
import { projectId, dataset } from "@/sanity/env";

interface StatCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  documentType: string;
  href: string;
}

function StatCardContent({ documentType }: { documentType: string }) {
  const { data: documents } = useDocuments({
    documentType,
    projectId,
    dataset,
  });

  return <div className="text-3xl font-bold">{documents?.length ?? 0}</div>;
}

function StatCard({ title, icon: Icon, documentType, href }: StatCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Suspense fallback={<Skeleton className="h-8 w-16" />}>
              <StatCardContent documentType={documentType} />
            </Suspense>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const QUICK_LINKS = [
  { href: "/admin/courses/new", label: "Create Course", icon: BookOpen },
  { href: "/admin/modules/new", label: "Create Module", icon: Layers },
  { href: "/admin/lessons/new", label: "Create Lesson", icon: PlayCircle },
  { href: "/admin/categories/new", label: "Create Category", icon: Tag },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your courses, modules, lessons, and categories
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Courses"
          icon={BookOpen}
          documentType="course"
          href="/admin/courses"
        />
        <StatCard
          title="Modules"
          icon={Layers}
          documentType="module"
          href="/admin/modules"
        />
        <StatCard
          title="Lessons"
          icon={PlayCircle}
          documentType="lesson"
          href="/admin/lessons"
        />
        <StatCard
          title="Categories"
          icon={Tag}
          documentType="category"
          href="/admin/categories"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{link.label}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
