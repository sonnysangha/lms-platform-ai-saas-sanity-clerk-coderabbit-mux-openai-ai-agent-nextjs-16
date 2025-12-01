"use client";

import { usePathname } from "next/navigation";
import { useQuery } from "@sanity/sdk-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { projectId, dataset } from "@/sanity/env";
import { defineQuery } from "groq";

// Pre-defined queries
const COURSE_QUERY = defineQuery(
  `*[_type == "course" && _id match "*" + $baseId][0]{ title }`,
);

const MODULE_QUERY = defineQuery(`{
  "module": *[_type == "module" && _id match "*" + $baseId][0]{ title },
  "course": *[_type == "course" && $baseId in modules[]._ref][0]{ _id, title }
}`);

const LESSON_QUERY = defineQuery(`{
  "lesson": *[_type == "lesson" && _id match "*" + $baseId][0]{ title },
  "module": *[_type == "module" && $baseId in lessons[]._ref][0]{ _id, title },
  "course": *[_type == "course" && count(modules[@._ref in *[_type == "module" && $baseId in lessons[]._ref]._id]) > 0][0]{ _id, title }
}`);

const CATEGORY_QUERY = defineQuery(
  `*[_type == "category" && _id match "*" + $baseId][0]{ title }`,
);

const NULL_QUERY = defineQuery(`null`);

function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const documentType = segments[1];
  const documentId = segments[2];

  // References always use base ID (without drafts. prefix)
  const baseId = documentId?.replace(/^drafts\./, "") || "";

  // Select query based on document type
  const query =
    documentId && documentType === "courses"
      ? COURSE_QUERY
      : documentId && documentType === "modules"
        ? MODULE_QUERY
        : documentId && documentType === "lessons"
          ? LESSON_QUERY
          : documentId && documentType === "categories"
            ? CATEGORY_QUERY
            : NULL_QUERY;

  const { data } = useQuery({
    query,
    params: { baseId },
    projectId,
    dataset,
  });

  // Don't show breadcrumb on dashboard
  if (segments.length <= 1) return null;

  // Build breadcrumb items
  const items: { href: string; label: string }[] = [
    { href: "/admin", label: "Admin" },
  ];

  if (documentType === "courses") {
    items.push({ href: "/admin/courses", label: "Courses" });
    if (documentId) {
      const title = (data as { title?: string } | null)?.title || "...";
      items.push({ href: pathname, label: title });
    }
  } else if (documentType === "modules") {
    const result = data as {
      module?: { title?: string };
      course?: { _id?: string; title?: string };
    } | null;

    if (result?.course?._id) {
      items.push({ href: "/admin/courses", label: "Courses" });
      items.push({
        href: `/admin/courses/${result.course._id}`,
        label: result.course.title || "...",
      });
    } else {
      items.push({ href: "/admin/modules", label: "Modules" });
    }

    if (documentId) {
      items.push({ href: pathname, label: result?.module?.title || "..." });
    }
  } else if (documentType === "lessons") {
    const result = data as {
      lesson?: { title?: string };
      module?: { _id?: string; title?: string };
      course?: { _id?: string; title?: string };
    } | null;

    if (result?.course?._id) {
      items.push({ href: "/admin/courses", label: "Courses" });
      items.push({
        href: `/admin/courses/${result.course._id}`,
        label: result.course.title || "...",
      });
    }

    if (result?.module?._id) {
      items.push({
        href: `/admin/modules/${result.module._id}`,
        label: result.module.title || "...",
      });
    } else if (!result?.course?._id) {
      items.push({ href: "/admin/lessons", label: "Lessons" });
    }

    if (documentId) {
      items.push({ href: pathname, label: result?.lesson?.title || "..." });
    }
  } else if (documentType === "categories") {
    items.push({ href: "/admin/categories", label: "Categories" });
    if (documentId) {
      const title = (data as { title?: string } | null)?.title || "...";
      items.push({ href: pathname, label: title });
    }
  } else {
    const labels: Record<string, string> = {
      courses: "Courses",
      modules: "Modules",
      lessons: "Lessons",
      categories: "Categories",
    };
    if (documentType && labels[documentType]) {
      items.push({
        href: `/admin/${documentType}`,
        label: labels[documentType],
      });
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span
              key={`${item.href}-${item.label}`}
              className="flex items-center gap-2"
            >
              {index > 0 && <BreadcrumbSeparator className="text-zinc-600" />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-zinc-300 truncate max-w-[180px]">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="hover:text-zinc-300 truncate max-w-[120px]"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AdminBreadcrumb;
