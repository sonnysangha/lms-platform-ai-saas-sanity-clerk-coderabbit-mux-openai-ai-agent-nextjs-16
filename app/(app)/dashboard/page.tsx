import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { CourseList } from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";
import { getUserTier } from "@/lib/course-access";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const [{ data: courses }, userTier] = await Promise.all([
    sanityFetch({ query: DASHBOARD_COURSES_QUERY }),
    getUserTier(),
  ]);

  const firstName = user.firstName ?? user.username ?? "there";

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
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">
              {userTier === "ultra"
                ? "Ultra Member"
                : userTier === "pro"
                  ? "Pro Member"
                  : "Free Member"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              {firstName}
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Pick up where you left off or discover something new. Your learning
            journey continues here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-sm text-zinc-500">Available Courses</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{userTier}</p>
                <p className="text-sm text-zinc-500">Current Plan</p>
              </div>
            </div>
          </div>

          {userTier !== "ultra" && (
            <Link
              href="/pricing"
              className="p-6 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 hover:border-violet-500/50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                    Upgrade to {userTier === "free" ? "Pro" : "Ultra"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Unlock more courses & features
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>

        {/* Course List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Courses</h2>
          <CourseList
            courses={courses}
            userTier={userTier}
            showFilters
            showSearch
            emptyMessage="No courses available yet. Check back soon!"
          />
        </div>
      </main>
    </div>
  );
}
