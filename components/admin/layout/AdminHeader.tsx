"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  PlayCircle,
  Tag,
  LayoutDashboard,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLogOutButton from "./AdminLogOutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/modules", label: "Modules", icon: Layers },
  { href: "/admin/lessons", label: "Lessons", icon: PlayCircle },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

function AdminHeader() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-xl">
      <div className="flex h-14 items-center px-6">
        {/* Logo */}
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-semibold mr-8"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg text-white">Admin</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/studio"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Open Studio
          </Link>
          <AdminLogOutButton />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
