"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { mockRetirementForecast, mockAssetAgeByCategory } from "@/lib/data/reports-mock";
import type { GlobalFilters } from "./global-filters";

interface Props { filters: GlobalFilters }

function urgencyBadge(days: number) {
  if (days < 90)  return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>;
  if (days < 180) return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Soon</Badge>;
  if (days < 365) return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Upcoming</Badge>;
  return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Planned</Badge>;
}

function daysColor(days: number) {
  if (days < 90)  return "text-red-600 font-semibold";
  if (days < 180) return "text-orange-600 font-medium";
  if (days < 365) return "text-amber-600";
  return "text-muted-foreground";
}

export function RetirementForecastSection({ filters }: Props) {
  const data = mockRetirementForecast.filter((r) => {
    if (filters.department !== "all" && r.department !== filters.department) return false;
    if (filters.category !== "all" && r.category !== filters.category) return false;
    return true;
  });

  const critical  = data.filter((r) => r.daysUntilRetirement < 90).length;
  const soon      = data.filter((r) => r.daysUntilRetirement >= 90 && r.daysUntilRetirement < 180).length;
  const upcoming  = data.filter((r) => r.daysUntilRetirement >= 180 && r.daysUntilRetirement < 365).length;
  const avgAge    = data.length ? (data.reduce((s, r) => s + r.ageYears, 0) / data.length).toFixed(1) : "—";

  const ageChartData = mockAssetAgeByCategory.map((c) => ({
    category: c.category.length > 14 ? c.category.slice(0, 14) + "…" : c.category,
    avgAge: c.avgAge,
    count: c.count,
  }));

  const ageColor = (age: number) => {
    if (age >= 7) return "#ef4444";
    if (age >= 5) return "#f59e0b";
    return "#3b82f6";
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Retirement Forecast</h2>
        <p className="text-sm text-muted-foreground">Assets approaching end-of-life and age analysis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Critical (< 90 days)", value: critical,  color: "text-red-600"     },
          { label: "Soon (90–180 days)",   value: soon,      color: "text-orange-600"  },
          { label: "Upcoming (< 1 year)",  value: upcoming,  color: "text-amber-600"   },
          { label: "Avg Asset Age",        value: `${avgAge} yrs`, color: "text-blue-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Age by category bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Average Asset Age by Category</CardTitle>
          <CardDescription>Older assets carry higher retirement risk</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ageChartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" yr" />
              <Tooltip
                formatter={(v) => [`${v} years`, "Avg Age"]}
                labelFormatter={(l) => `Category: ${l}`}
              />
              <Bar dataKey="avgAge" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {ageChartData.map((entry, i) => (
                  <Cell key={i} fill={ageColor(entry.avgAge)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 justify-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500 inline-block" /> &lt; 5 yrs (Good)</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500 inline-block" /> 5–7 yrs (Ageing)</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-500 inline-block" /> &gt; 7 yrs (Critical)</span>
          </div>
        </CardContent>
      </Card>

      {/* Retirement forecast table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Retirement Forecast Table</CardTitle>
          <CardDescription>Sorted by urgency — plan procurement ahead of time</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Age</TableHead>
                <TableHead className="text-right">Purchase Yr</TableHead>
                <TableHead className="text-right">Retire Yr</TableHead>
                <TableHead className="text-right">Days Left</TableHead>
                <TableHead>Urgency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-6">No data</TableCell>
                </TableRow>
              ) : [...data].sort((a, b) => a.daysUntilRetirement - b.daysUntilRetirement).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.department}</TableCell>
                  <TableCell className="text-right text-sm">{r.ageYears} yrs</TableCell>
                  <TableCell className="text-right text-sm font-mono">{r.purchaseYear}</TableCell>
                  <TableCell className="text-right text-sm font-mono">{r.retirementYear}</TableCell>
                  <TableCell className={`text-right text-sm ${daysColor(r.daysUntilRetirement)}`}>
                    {r.daysUntilRetirement}
                  </TableCell>
                  <TableCell>{urgencyBadge(r.daysUntilRetirement)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
