"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { useOptionalAuth } from "@/store/authStore";

/**
 * Conditionally renders Header and Footer based on the current route.
 * Hides them on admin pages and provider dashboard pages.
 *
 * Additionally, when an ADMIN or PROVIDER is on the home route ("/"),
 * we hide the public Header/Footer to avoid a flash of the logged-in shell
 * while the page-level redirect to /admin runs.
 */
export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useOptionalAuth();
  const user = auth?.user;

  const isAdminPage = pathname?.startsWith("/admin");
  const isProviderPage = pathname?.startsWith("/providers");
  const isHomePage = pathname === "/";
  const isAdminOrProvider = user && (user.role === "ADMIN" || user.role === "PROVIDER");

  // Hide header/footer on:
  // - admin routes
  // - provider routes
  // - home route when the user is ADMIN or PROVIDER (since they will be redirected)
  const hideShell = isAdminPage || isProviderPage || (isHomePage && !!isAdminOrProvider);

  return (
    <>
      {!hideShell && <Header />}
      {children}
      {!hideShell && <Footer />}
    </>
  );
}




