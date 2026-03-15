"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { ProviderSidebar, type ProviderNavId } from "@/components/provider/ProviderSidebar";
import { ProviderHeader } from "@/components/provider/ProviderHeader";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [activeNav, setActiveNav] = useState<ProviderNavId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (pathname === "/providers/dashboard") {
      const navParam = searchParams.get("nav");
      if (navParam && ["dashboard", "listings", "tours", "subscriptions"].includes(navParam)) {
        setActiveNav(navParam as ProviderNavId);
      } else {
        setActiveNav("dashboard");
      }
    } else if (pathname.startsWith("/providers/listings")) {
      setActiveNav("listings");
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "PROVIDER") {
      router.push("/");
      return;
    }
  }, [user, loading, router]);

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

  if (!user || user.role !== "PROVIDER") {
    return null;
  }

  const handleNavChange = (id: ProviderNavId) => {
    setActiveNav(id);
    if (id === "dashboard") {
      router.push("/providers/dashboard");
    } else {
      router.push(`/providers/dashboard?nav=${id}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <ProviderSidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ProviderHeader 
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

