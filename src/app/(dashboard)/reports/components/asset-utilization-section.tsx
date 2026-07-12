"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";
import { mockAssetUtilization, type AssetUtilizationItem } from "@/lib/data/reports-mock";
import type { GlobalFilters } from "./global-filters";

interface Props { filters: GlobalFilters }

function utilizationColor(pct: number) {
  if (pct >= 80) return "#22c55e";
  if (pct >= 50) return "#f59e0b";
  return "#ef4444";
}

function utilizationBadge(pct: number) {
  if (pct >= 80) return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">High</Badge>;
  if (pct >= 50) return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>;
  return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low</Badge>;
}

function TrendCell({ trend }: { trend: number }) {
  if (trend > 0) return <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-medium"><TrendingUp className="h-3 w-3" />+{trend}%</span>;
  if (trend < 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-medium"><TrendingDown className="h-3 w-3" />{trend}%</span>;
  return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus className="h-3 w-3" />0%</span>;
}

export function AssetUtilizationSection({ filters }: Props) {
  const data: AssetUtilizationItem[] = mockAssetUtilization.filter((a) => {
    if (filters.department !== "all" && a.department !== filters.department) return false;
    if (filters.category !== "all" && a.category !== filters.category) return false;
    return true;
  });

  const sorted = [...data].sort((a, b) => b.usagePercent - a.usagePercent);
  const top5 = sorted.slice(0, 5);
  const bottom5 = [...sorted].reverse().slice(0, 5);
  const avgUtil = data.length ? Math.round(data.reduce((s, a) => s + a.usagePercent, 0) / data.length) : 0;

  const chartData = sorted.map((a) => ({ name: a.name.length > 18 ? a.name.slice(0, 18) + "…" : a.name, pct: a.usagePercent }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Asset Utilization</h2>
        <p className="text-sm text-muted-foreground">Usage rates across your asset inventory</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Avg Utilization", value: `${avgUtil}%`, color: "text-blue-600" },
          { label: "High Utilization (≥80%)", value: data.filter(a => a.usagePercent >= 80).length, color: "text-emerald-600" },
          { label: "Low Utilization (<50%)", value: data.filter(a => a.usagePercent < 50).length, color: "text-red-500" },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Utilization by Asset</CardTitle>
          <CardDescription>Sorted highest to lowest usage percentage</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">No data for selected filters</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 40, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, "Utilization"]} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={utilizationColor(entry.pct)} />
                  ))}
                  <LabelList dataKey="pct" position="right" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 11, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Most / Least used tables */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: "Most Used Assets", rows: top5, label: "Top 5 by utilization" },
          { title: "Least Used Assets", rows: bottom5, label: "Bottom 5 by utilization" },
        ].map(({ title, rows, label }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{label}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">No data</TableCell></TableRow>
                  ) : rows.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-sm">{a.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.category}</TableCell>
                      <TableCell className="text-right">{utilizationBadge(a.usagePercent)}</TableCell>
                      <TableCell className="text-right"><TrendCell trend={a.trend} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
