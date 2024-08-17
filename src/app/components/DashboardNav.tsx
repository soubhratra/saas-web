"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, navItemsAdmin } from "./UserNav";

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent" : "bg-transparent"
            )}
          >
            <item.icon className="mr-2 h-6 w-6 text-primary" />
            <span>{item.name}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

export function DashboardNavAdmin() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {navItemsAdmin.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent" : "bg-transparent"
            )}
          >
            <item.icon className="mr-2 h-6 w-6 text-primary" />
            <span>{item.name}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}