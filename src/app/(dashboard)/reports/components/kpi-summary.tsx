"use client";

import { Package, TrendingUp, TrendingDown, Wrench, AlertTriangle, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: number;
  trendLabel: string;
  accentClass: string;
}

function KpiCard({ title, value, subtitle, icon, trend, trendLabel, accentClass }: KpiCardProps) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-muted-foreground";

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-y-0 left-0 w-1 ${accentClass}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pl-5">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiSummary() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Assets"
        value="248"
        subtitle="Across all departments"
        icon={<Package className="h-4 w-4" />}
        trend={5}
        trendLabel="+12 from last quarter"
        accentClass="bg-blue-500"
      />
      <KpiCard
        title="Avg Utilization"
        value="68.4%"
        subtitle="Asset usage rate"
        icon={<TrendingUp className="h-4 w-4" />}
        trend={3}
        trendLabel="+3.2% from last month"
        accentClass="bg-emerald-500"
      />
      <KpiCard
        title="Pending Maintenance"
        value="12"
        subtitle="Requests awaiting action"
        icon={<Wrench className="h-4 w-4" />}
        trend={-1}
        trendLabel="+4 since last week"
        accentClass="bg-orange-500"
      />
      <KpiCard
        title="Near Retirement"
        value="7"
        subtitle="Assets retiring within 1 year"
        icon={<AlertTriangle className="h-4 w-4" />}
        trend={-1}
        trendLabel="2 critical (< 90 days)"
        accentClass="bg-red-500"
      />
    </div>
  );
}
