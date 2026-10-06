
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f4f8fd]">
      {/* <AppSidebar /> */}

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}