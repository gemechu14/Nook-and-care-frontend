"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptionalAuth } from "@/store/authStore";
import { providersApi } from "@/features/providers/services";
import { getNavItems, PHONE_NUMBER } from "./_lib/constants";
import { getHeaderTheme } from "./_lib/theme";
import { useHeaderState } from "./_hooks/useHeaderState";
import { ProviderVerifyModal } from "./_components/ProviderVerifyModal";
import { Logo } from "./_components/Logo";
import { UserMenu } from "./_components/UserMenu";
import { MobileMenu } from "./_components/MobileMenu";
import {
  GlobeIcon,
  PhoneIcon,
  MenuIcon,
  CloseIcon,
  ProviderBuildingIcon,
} from "./_components/HeaderIcons";

export default function Header() {
  const router = useRouter();
  const auth = useOptionalAuth();
  const user = auth?.user;
  const loading = auth?.loading ?? false;

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("access_token");
  const showLoading = loading && hasToken;

  const {
    pathname: _pathname,
    userMenuOpen,
    mobileMenuOpen,
    showProviderModal,
    setShowProviderModal,
    hasProvider,
    userMenuRef,
    mobileMenuRef,
    hideHeader,
    isWhiteHeader,
    isFamily,
    toggleUserMenu,
    toggleMobileMenu,
    setUserMenuOpen,
    setMobileMenuOpen,
  } = useHeaderState(user ?? null);

  const theme = getHeaderTheme(isWhiteHeader);
  const navItems = getNavItems(user?.role);
  const role = user?.role;

  const handleLogout = async () => {
    if (auth?.logout) {
      await auth.logout();
      router.push("/");
    }
  };

  const handleBecomeProvider = async (
    businessName: string,
    businessType: string,
    state: string
  ) => {
    if (!user) return;
    setShowProviderModal(false);
    try {
      await providersApi.create({
        user_id: user.id,
        business_name: businessName,
        business_type: businessType,
        address: "",
        city: state,
        country: "USA",
      });
      await auth?.refreshUser?.();
      router.push("/providers/register?welcome=1");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to register as provider. Please try again."
      );
    }
  };

  if (hideHeader) return null;

  return (
    <>
      {showProviderModal && (
        <ProviderVerifyModal
          onCancel={() => setShowProviderModal(false)}
          onConfirm={handleBecomeProvider}
        />
      )}

      <header className={theme.header}>
        <nav className="flex h-16 items-center justify-between px-6 lg:px-[144px]">
          <Logo role={role} textColor={theme.text} />

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`font-medium ${theme.text} ${theme.textHover} transition-colors`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {role !== "ADMIN" && (
              <>
                <button
                  className={`hidden items-center gap-1 text-sm ${theme.icon} ${theme.iconHover} transition-colors lg:flex`}
                  type="button"
                >
                  <GlobeIcon className="h-4 w-4" />
                  <span>US</span>
                </button>
                <button
                  className={`hidden text-sm font-bold ${theme.icon} ${theme.iconHover} transition-colors lg:block`}
                  type="button"
                >
                  T
                </button>
                <a
                  href="tel:18005550123"
                  className={`hidden items-center gap-2 text-sm font-medium ${theme.icon} ${theme.iconHover} transition-colors lg:flex`}
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>{PHONE_NUMBER}</span>
                </a>
              </>
            )}

            <div className="hidden md:block">
              {showLoading ? (
                <div className="flex h-9 w-[80px] items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
                </div>
              ) : (
                <>
                  {user ? (
                    <UserMenu
                      user={user}
                      isOpen={userMenuOpen}
                      onToggle={toggleUserMenu}
                      onClose={() => setUserMenuOpen(false)}
                      onLogout={handleLogout}
                      isWhiteHeader={isWhiteHeader}
                      menuRef={userMenuRef}
                    />
                  ) : (
                    <Link href="/login" className={theme.signInButton}>
                      Sign In
                    </Link>
                  )}
                </>
              )}
            </div>

            {!loading && user && isFamily && !hasProvider && (
              <button
                type="button"
                onClick={() => setShowProviderModal(true)}
                className={`hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors md:flex ${theme.providerButton}`}
              >
                <ProviderBuildingIcon className="h-4 w-4 text-teal-600" />
                <span>I&apos;m a Provider</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`md:hidden ${theme.text} focus:outline-none`}
              aria-label="Mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        <MobileMenu
          isOpen={mobileMenuOpen}
          navItems={navItems}
          user={user ?? null}
          isWhiteHeader={isWhiteHeader}
          hasProvider={hasProvider}
          isFamily={!!isFamily}
          showLoading={showLoading}
          onClose={() => setMobileMenuOpen(false)}
          onLogout={handleLogout}
          onProviderClick={() => setShowProviderModal(true)}
          menuRef={mobileMenuRef}
        />
      </header>
    </>
  );
}
