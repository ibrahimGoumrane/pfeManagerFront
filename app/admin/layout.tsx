import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing reports and users",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b  bg- text-white">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Link
            href="/admin"
            className="flex text-pfebrand items-center gap-2 font-bold text-xl text-md sm:text-lg md:text-xl  tracking-tight"
          >
            <span className=" ">Pfe</span>
            <span className="bg-pfebrand text-white px-2 rounded">Archive</span>
          </Link>
          <AdminNav className="mx-6" />
        </div>
      </header>
      <main className="flex-1 bg-slate-50">{children}</main>
    </div>
  );
}
