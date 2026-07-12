import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AssetUtilizationChart,
  AssetUtilizationLegend,
  AssetsByCategoryChart,
  MonthlyGrowthChart,
} from "./components/dashboard-charts";
import { RecentActivity } from "./components/recent-activity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your enterprise assets and resources.
        </p>
      </div>

      {/* ── KPI Cards (unchanged) ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +24 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              12 critical tasks pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last audit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 1: Asset Utilization Bar + Recent Activity ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Asset Utilization by Department</CardTitle>
            <CardDescription>Utilized vs. idle assets across all departments</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <AssetUtilizationChart />
            <AssetUtilizationLegend />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest asset updates, bookings and alerts</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Pie Chart + Growth Line ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Assets by Category</CardTitle>
            <CardDescription>Distribution across all asset categories</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <AssetsByCategoryChart />
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Asset Growth</CardTitle>
            <CardDescription>Total registered assets Jan – Aug 2025</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-6">
            <MonthlyGrowthChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
