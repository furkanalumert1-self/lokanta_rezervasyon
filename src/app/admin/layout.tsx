import AdminSidebar from "@/components/AdminSidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-16 md:pt-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
