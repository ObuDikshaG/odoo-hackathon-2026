import Link from "next/link";
import { LayoutDashboard, Package, CalendarDays, Wrench, FileCheck, BarChart3, Bell, Building2 } from "lucide-react";

export function Sidebar() {
  const routes = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Organization Setup", icon: Building2, href: "/organization-setup" },
    { name: "Assets", icon: Package, href: "/assets" },
    { name: "Booking", icon: CalendarDays, href: "/booking" },
    { name: "Maintenance", icon: Wrench, href: "/maintenance" },
    { name: "Audit", icon: FileCheck, href: "/audit" },
    { name: "Reports & Analytics", icon: BarChart3, href: "/reports" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center px-6 border-b">
        <Package className="h-6 w-6 mr-2 text-primary" />
        <span className="font-bold text-lg">AssetFlow</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <route.icon className="h-4 w-4" />
              {route.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
