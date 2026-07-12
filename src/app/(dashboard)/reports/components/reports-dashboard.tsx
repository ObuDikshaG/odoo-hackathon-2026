"use client";

import { useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { KpiSummary } from "./kpi-summary";
import { GlobalFilterBar, GlobalFilters } from "./global-filters";
import { AssetUtilizationSection } from "./asset-utilization-section";
import { DepartmentAllocationSection } from "./department-allocation-section";
import { MaintenanceAnalyticsSection } from "./maintenance-analytics-section";
import { RetirementForecastSection } from "./retirement-forecast-section";
import { BookingAnalyticsSection } from "./booking-analytics-section";
import { ExportButton } from "./export-button";

const DEFAULT_FILTERS: GlobalFilters = {
  department: "all",
  category:   "all",
  status:     "all",
  dateFrom:   "",
  dateTo:     "",
};

export function ReportsDashboard() {
  const [filters, setFilters] = useState<GlobalFilters>(DEFAULT_FILTERS);

  return (
    <div className="space-y-8">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports &amp; Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Live dashboard — all figures drawn from mock data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset
          </Button>
          <ExportButton />
        </div>
      </div>

      {/* ── KPI cards ─────────────────────────────────────────────── */}
      <KpiSummary />

      {/* ── Global filters ────────────────────────────────────────── */}
      <GlobalFilterBar filters={filters} onChange={setFilters} />

      {/* ── Divider ───────────────────────────────────────────────── */}
      <hr className="border-border" />

      {/* ── Section 1 — Asset Utilization ─────────────────────────── */}
      <AssetUtilizationSection filters={filters} />

      <hr className="border-border" />

      {/* ── Section 2 — Department Allocation ────────────────────── */}
      <DepartmentAllocationSection filters={filters} />

      <hr className="border-border" />

      {/* ── Section 3 — Maintenance Analytics ─────────────────────── */}
      <MaintenanceAnalyticsSection filters={filters} />

      <hr className="border-border" />

      {/* ── Section 4 — Retirement Forecast ───────────────────────── */}
      <RetirementForecastSection filters={filters} />

      <hr className="border-border" />

      {/* ── Section 5 — Booking Analytics ─────────────────────────── */}
      <BookingAnalyticsSection filters={filters} />
    </div>
  );
}
