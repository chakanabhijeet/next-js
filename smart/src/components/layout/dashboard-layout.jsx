
import AppSidebar from "@/components/common/app-sidebar";
import { AuthGuard } from "@/components/common/auth-guard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f4f8fd]">
        <AppSidebar />

        <main className="min-h-screen min-w-0 transition-all duration-300 lg:ml-[var(--sidebar-width,248px)]">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}