"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { mockDepartmentAllocation } from "@/lib/data/reports-mock";
import type { GlobalFilters } from "./global-filters";

interface Props { filters: GlobalFilters }

const COLORS = { active: "#3b82f6", available: "#22c55e", underMaintenance: "#f59e0b" };

export function DepartmentAllocationSection({ filters }: Props) {
  const data = mockDepartmentAllocation.filter((d) => {
    if (filters.department !== "all" && d.department !== filters.department) return false;
    return true;
  });

  const chartData = data.map((d) => ({
    dept: d.department.length > 14 ? d.department.slice(0, 14) + "…" : d.department,
    Active: d.active,
    Available: d.available,
    Maintenance: d.underMaintenance,
  }));

  const totals = data.reduce(
    (acc, d) => ({
      total: acc.total + d.total,
      active: acc.active + d.active,
      available: acc.available + d.available,
      maintenance: acc.maintenance + d.underMaintenance,
    }),
    { total: 0, active: 0, available: 0, maintenance: 0 }
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Department-wise Allocation</h2>
        <p className="text-sm text-muted-foreground">Assets distributed across departments</p>
      </div>

      {/* Summary stat pills */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Assets", value: totals.total, color: "text-foreground" },
          { label: "Active Allocations", value: totals.active, color: "text-blue-600" },
          { label: "Available", value: totals.available, color: "text-emerald-600" },
          { label: "Under Maintenance", value: totals.maintenance, color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Stacked bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allocation by Department</CardTitle>
          <CardDescription>Stacked view of active, available, and maintenance assets</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">No data for selected filters</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Active" stackId="a" fill={COLORS.active} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Available" stackId="a" fill={COLORS.available} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Maintenance" stackId="a" fill={COLORS.underMaintenance} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Detail table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Department Summary Table</CardTitle>
          <CardDescription>Full breakdown per department</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Active</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Maintenance</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">No data</TableCell>
                </TableRow>
              ) : data.map((d) => {
                const pct = d.total > 0 ? Math.round((d.active / d.total) * 100) : 0;
                return (
                  <TableRow key={d.department}>
                    <TableCell className="font-medium">{d.department}</TableCell>
                    <TableCell className="text-right">{d.total}</TableCell>
                    <TableCell className="text-right text-blue-600 font-medium">{d.active}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">{d.available}</TableCell>
                    <TableCell className="text-right text-amber-600 font-medium">{d.underMaintenance}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-medium w-9 text-right">{pct}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
