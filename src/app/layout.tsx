import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import StoreInitializer from "@/store/StoreInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nook — Find the Right Senior Care",
  description:
    "Find verified senior housing and care communities near you. Assisted living, memory care, independent living, adult family homes, and skilled nursing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <StoreInitializer />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
