"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Users, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type AdminNavProps = React.HTMLAttributes<HTMLElement>

export function AdminNav({ className, ...props }: AdminNavProps) {
  const pathname = usePathname()
  // Extract the pathname first two parts of the URL
  const pathParts = pathname.split("/").slice(0, 3).join("/")
  const navItems = [
    {
      name: "Reports",
      href: "/admin/reports",
      icon: FileText,
      active: pathParts === "/admin/reports",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      active: pathParts === "/admin/users",
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn("hidden md:flex items-center space-x-6", className)} {...props}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-2 py-3 rounded-lg gap-1.5 text-sm font-medium transition-colors",
              item.active
                ? "bg-pfebrand  text-white font-medium hover:text-pfebrand hover:bg-white"
                : "text-pfebrand  hover:bg-pfebrand/10",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-pfebrand">
              Menu <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    item.active ? "text-pfebrand font-medium" : "text-pfebrand",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

