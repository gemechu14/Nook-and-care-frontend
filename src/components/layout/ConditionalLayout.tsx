"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Conditionally renders Header and Footer based on the current route.
 * Hides them on admin pages.
 */
export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isProviderPage = pathname?.startsWith("/providers");

  return (
    <>
      {!isAdminPage && !isProviderPage && <Header />}
      {children}
      {!isAdminPage && !isProviderPage && <Footer />}
    </>
  );
}




