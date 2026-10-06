"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  Ticket,
  Tag,
  CreditCard,
  Bell,
  FileText,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/admin/enrollments", label: "Enrollments", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/tickets", label: "Support Tickets", icon: Ticket },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r bg-muted/30 hidden lg:block overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-2 px-3 py-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-semibold">Admin Panel</span>
        </div>
        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
