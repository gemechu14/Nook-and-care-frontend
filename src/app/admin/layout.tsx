"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { Sidebar, type NavId } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync activeNav with URL
  useEffect(() => {
    if (pathname === "/admin") {
      const navParam = searchParams.get("nav");
      if (
        navParam &&
        ["dashboard", "providers", "listings", "masterCatalog", "subscriptions", "reports"].includes(navParam)
      ) {
        setActiveNav(navParam as NavId);
      } else {
        setActiveNav("dashboard");
      }
    } else if (pathname.startsWith("/admin/listings")) {
      setActiveNav("listings");
    }
  }, [pathname, searchParams]);

  // Auth check
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    // Allow both ADMIN and PROVIDER roles
    if (user.role !== "ADMIN" && user.role !== "PROVIDER") {
      router.push("/");
      return;
    }
  }, [user, loading, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "PROVIDER")) {
    return null;
  }

  const handleNavChange = (id: NavId) => {
    setActiveNav(id);
    if (id === "dashboard") {
      router.push("/admin");
    } else {
      router.push(`/admin?nav=${id}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isCollapsed ? "lg:ml-16" : "lg:ml-56"
      }`}>
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

