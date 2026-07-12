"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { mockMaintenanceTrend, mockPendingMaintenance } from "@/lib/data/reports-mock";
import type { GlobalFilters } from "./global-filters";

interface Props { filters: GlobalFilters }

const PRIORITY_MAP = {
  Critical: "bg-red-100 text-red-800 hover:bg-red-100",
  High:     "bg-orange-100 text-orange-800 hover:bg-orange-100",
  Medium:   "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Low:      "bg-slate-100 text-slate-700 hover:bg-slate-100",
} as const;

export function MaintenanceAnalyticsSection({ filters }: Props) {
  const pending = mockPendingMaintenance.filter((m) => {
    if (filters.department !== "all" && m.department !== filters.department) return false;
    if (filters.category !== "all" && m.category !== filters.category) return false;
    return true;
  });

  const totalPending = mockMaintenanceTrend.at(-1)?.pending ?? 0;
  const totalCompleted = mockMaintenanceTrend.reduce((s, m) => s + m.completed, 0);
  const criticalCount = pending.filter((m) => m.priority === "Critical").length;
  const totalCost = mockMaintenanceTrend.reduce((s, m) => s + m.cost, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Maintenance Analytics</h2>
        <p className="text-sm text-muted-foreground">Maintenance trends and pending request tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pending Requests", value: totalPending, color: "text-orange-600" },
          { label: "Critical Priority", value: criticalCount, color: "text-red-600" },
          { label: "Completed (6 mo)", value: totalCompleted, color: "text-emerald-600" },
          { label: "Est. Cost (6 mo)", value: `$${(totalCost / 1000).toFixed(1)}k`, color: "text-blue-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Area chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Maintenance Trend (6 months)</CardTitle>
          <CardDescription>Completed vs pending requests over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockMaintenanceTrend} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" fill="url(#completedGrad)" strokeWidth={2} dot={{ r: 3 }} />
              <Area type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" fill="url(#pendingGrad)" strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pending requests table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Maintenance Requests</CardTitle>
          <CardDescription>Sorted by priority — action required</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No pending maintenance requests
                  </TableCell>
                </TableRow>
              ) : pending.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.asset}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.department}</TableCell>
                  <TableCell className="text-sm">{m.issue}</TableCell>
                  <TableCell>
                    <Badge className={PRIORITY_MAP[m.priority]}>{m.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{m.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
