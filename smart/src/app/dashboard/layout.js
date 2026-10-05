import AppSidebar from "@/components/common/app-sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}