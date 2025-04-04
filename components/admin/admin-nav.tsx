"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Users } from "lucide-react"

interface AdminNavProps extends React.HTMLAttributes<HTMLElement> {}

export function AdminNav({ className, ...props }: AdminNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Reports",
      href: "/admin/reports",
      icon: FileText,
      active: pathname === "/admin/reports",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      active: pathname === "/admin/users",
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white/80",
            item.active ? "text-white" : "text-white/60",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

