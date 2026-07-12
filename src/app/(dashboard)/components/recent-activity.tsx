"use client";

import { Badge } from "@/components/ui/badge";
import {
  Laptop,
  Printer,
  Wrench,
  ArrowRightLeft,
  CalendarCheck,
  ShieldCheck,
  PackagePlus,
  UserCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  badge: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  badgeClass: string;
}

const activities: Activity[] = [
  {
    id: "1",
    icon: UserCheck,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    title: "Asset Allocated",
    description: "Dell Latitude 5540 assigned to Rahul Sharma (IT Dept.)",
    time: "2 min ago",
    badge: "Allocation",
    badgeVariant: "default",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: "2",
    icon: PackagePlus,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    title: "Asset Registered",
    description: "HP LaserJet Pro added by Admin (Asset #AST-1249)",
    time: "14 min ago",
    badge: "Asset",
    badgeVariant: "secondary",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  },
  {
    id: "3",
    icon: Wrench,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-950",
    title: "Maintenance Completed",
    description: "Scheduled service completed for Dell Laptop #AST-0043",
    time: "1 hr ago",
    badge: "Maintenance",
    badgeVariant: "secondary",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  {
    id: "4",
    icon: ArrowRightLeft,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100 dark:bg-purple-950",
    title: "Asset Transferred",
    description: "MacBook Air M2 transferred from IT to HR Department",
    time: "2 hr ago",
    badge: "Allocation",
    badgeVariant: "default",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    id: "5",
    icon: CalendarCheck,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-100 dark:bg-sky-950",
    title: "Booking Approved",
    description: "Conference Room Projector booked by Finance team (Mon–Wed)",
    time: "3 hr ago",
    badge: "Booking",
    badgeVariant: "secondary",
    badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  },
  {
    id: "6",
    icon: ShieldCheck,
    iconColor: "text-green-600",
    iconBg: "bg-green-100 dark:bg-green-950",
    title: "Audit Completed",
    description: "Q2 asset audit completed — 98.5% compliance achieved",
    time: "5 hr ago",
    badge: "Audit",
    badgeVariant: "outline",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  {
    id: "7",
    icon: AlertCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-100 dark:bg-red-950",
    title: "Maintenance Overdue",
    description: "Cisco Switch #AST-0112 is 7 days past scheduled service",
    time: "Yesterday",
    badge: "Critical",
    badgeVariant: "destructive",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  {
    id: "8",
    icon: Printer,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100 dark:bg-orange-950",
    title: "Asset Retired",
    description: "Canon Printer #AST-0027 marked as retired after 6 years",
    time: "Yesterday",
    badge: "Asset",
    badgeVariant: "secondary",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    id: "9",
    icon: Laptop,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100 dark:bg-indigo-950",
    title: "Asset Returned",
    description: "Lenovo ThinkPad returned by Meera Patel (Sales)",
    time: "2 days ago",
    badge: "Allocation",
    badgeVariant: "default",
    badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  {
    id: "10",
    icon: RefreshCw,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100 dark:bg-teal-950",
    title: "Preventive Maintenance",
    description: "Scheduled PM initiated for Server Rack A — 12 assets",
    time: "2 days ago",
    badge: "Maintenance",
    badgeVariant: "secondary",
    badgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">
      {activities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {/* Icon bubble */}
            <div
              className={cn(
                "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-0.5",
                activity.iconBg
              )}
            >
              <Icon className={cn("h-4 w-4", activity.iconColor)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <Badge
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4 shrink-0 border-0",
                    activity.badgeClass
                  )}
                >
                  {activity.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {activity.description}
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">{activity.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
