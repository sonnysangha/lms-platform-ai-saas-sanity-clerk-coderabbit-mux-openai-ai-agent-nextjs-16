import { Suspense } from "react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminBreadcrumb from "@/components/admin/layout/AdminBreadcrumb";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Providers } from "@/components/Providers";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-muted/30">
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
          <div className="px-6 py-4">
            <AdminBreadcrumb />
          </div>
          <main className="px-6 pb-8">{children}</main>
        </Suspense>
      </div>
    </Providers>
  );
}

export default AdminLayout;
