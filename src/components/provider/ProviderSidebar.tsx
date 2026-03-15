"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";

export type ProviderNavId = "dashboard" | "listings" | "tours" | "subscriptions";

interface ProviderSidebarProps {
  activeNav: ProviderNavId;
  onNavChange: (id: ProviderNavId) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
}

const NAV = [
  { 
    id: "dashboard" as ProviderNavId, 
    label: "Dashboard", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    id: "listings" as ProviderNavId, 
    label: "Listings", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  { 
    id: "tours" as ProviderNavId, 
    label: "Tours", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: "subscriptions" as ProviderNavId, 
    label: "Subscriptions", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
];

export function ProviderSidebar({ activeNav, onNavChange, isOpen, onClose, isCollapsed = false }: ProviderSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-mobile-menu-button]')) {
          onClose();
        }
      }
    };
    if (avatarMenuOpen || isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen, isOpen, onClose]);

  const handleNavClick = (id: ProviderNavId) => {
    onNavChange(id);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-[#1a2035] text-white flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "w-16 lg:w-16" : "w-64 sm:w-56 lg:w-56"}
        `}
      >
        <div className={`flex items-center gap-2.5 px-5 py-5 border-b border-white/10 ${isCollapsed ? "justify-center px-0" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-sm shrink-0">
            N
          </div>
          {!isCollapsed && <span className="font-bold text-base whitespace-nowrap">Provider</span>}
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest px-3 mb-3">
              Menu
            </p>
          )}
          <ul className="space-y-0.5">
            {NAV.map(({ id, label, icon }) => (
              <li key={id}>
                <button
                  onClick={() => handleNavClick(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    activeNav === id
                      ? "bg-teal-500/20 text-teal-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                  title={isCollapsed ? label : undefined}
                >
                  <span className="shrink-0">{icon}</span>
                  {!isCollapsed && <span>{label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div ref={avatarMenuRef} className={`px-4 py-4 border-t border-white/10 relative ${isCollapsed ? "px-2" : ""}`}>
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className={`w-full flex items-center gap-2.5 hover:bg-white/5 rounded-lg p-2 transition-colors ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? `${user?.full_name ?? "Provider"}\n${user?.email}` : undefined}
          >
            <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0">
              {user?.full_name?.[0] ?? "P"}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">{user?.full_name ?? "Provider"}</p>
                  <p className="text-xs text-white/40 truncate">{user?.email}</p>
                </div>
                <svg 
                  className={`w-4 h-4 text-white/40 transition-transform shrink-0 ${avatarMenuOpen ? "rotate-180" : ""}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {avatarMenuOpen && (
            <div className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 ${
              isCollapsed ? "left-0 right-auto min-w-[200px]" : "left-0 right-0"
            }`}>
              <button
                onClick={() => {
                  setAvatarMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <div className="border-t border-slate-100 mt-1">
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

