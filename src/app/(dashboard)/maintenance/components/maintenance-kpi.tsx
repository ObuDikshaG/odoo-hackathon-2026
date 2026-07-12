"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceRequest } from "@/lib/data/maintenanceStore";
import { Wrench, AlertTriangle, CalendarClock, Activity } from "lucide-react";

interface MaintenanceKpiProps {
  requests: MaintenanceRequest[];
}

export function MaintenanceKpi({ requests }: MaintenanceKpiProps) {
  const total = requests.length;

  const overdue = requests.filter((r) => {
    if (r.status === "Completed") return false;
    if (r.status === "Overdue") return true;
    if (r.nextServiceDate) {
      const today = new Date().toISOString().split("T")[0];
      return r.nextServiceDate < today;
    }
    return false;
  }).length;

  const upcoming = requests.filter((r) => {
    if (r.status === "Completed") return false;
    if (r.nextServiceDate) {
      const today = new Date().toISOString().split("T")[0];
      return r.nextServiceDate >= today;
    }
    return false;
  }).length;

  const uniqueAssetsUnderMaintenance = new Set(
    requests
      .filter((r) => r.status === "In Progress")
      .map((r) => r.assetId)
  ).size;

  const cards = [
    {
      title: "Total Requests",
      value: total,
      icon: Wrench,
      description: "All servicing requests",
      colorClass: "text-blue-600",
    },
    {
      title: "Overdue Requests",
      value: overdue,
      icon: AlertTriangle,
      description: "Servicing schedule missed",
      colorClass: overdue > 0 ? "text-destructive" : "text-muted-foreground",
    },
    {
      title: "Upcoming Servicing",
      value: upcoming,
      icon: CalendarClock,
      description: "Scheduled future maintenance",
      colorClass: "text-amber-600",
    },
    {
      title: "Assets in Maintenance",
      value: uniqueAssetsUnderMaintenance,
      icon: Activity,
      description: "Currently in progress",
      colorClass: "text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.colorClass}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
