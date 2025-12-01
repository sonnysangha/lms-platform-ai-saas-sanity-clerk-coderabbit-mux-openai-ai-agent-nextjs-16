import { Suspense } from "react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminBreadcrumb from "@/components/admin/layout/AdminBreadcrumb";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Providers } from "@/components/Providers";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-[#09090b] text-white">
        {/* Subtle noise texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <Suspense
          fallback={
            <LoadingSpinner
              text="Loading Admin Dashboard..."
              isFullScreen
              size="lg"
            />
          }
        >
          <AdminHeader />
          <div className="relative z-10 px-6 py-4">
            <AdminBreadcrumb />
          </div>
          <main className="relative z-10 px-6 pb-8 container mx-auto">
            {children}
          </main>
        </Suspense>
      </div>
    </Providers>
  );
}

export default AdminLayout;
