"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import {
  mockBookingHeatmap,
  mockMostBookedResources,
  mockBookingTrend,
} from "@/lib/data/reports-mock";
import type { GlobalFilters } from "./global-filters";

interface Props { filters: GlobalFilters }

const HOURS = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"];
const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const MAX_COUNT = Math.max(...mockBookingHeatmap.map((c) => c.count));

function heatColor(count: number) {
  const intensity = count / MAX_COUNT;
  if (intensity >= 0.8) return "bg-blue-700 text-white";
  if (intensity >= 0.6) return "bg-blue-500 text-white";
  if (intensity >= 0.4) return "bg-blue-300 text-blue-900";
  if (intensity >= 0.2) return "bg-blue-100 text-blue-800";
  return "bg-slate-50 text-slate-400";
}

function TrendCell({ trend }: { trend: number }) {
  if (trend > 0) return <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-medium"><TrendingUp className="h-3 w-3" />+{trend}</span>;
  if (trend < 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-medium"><TrendingDown className="h-3 w-3" />{trend}</span>;
  return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus className="h-3 w-3" />0</span>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BookingAnalyticsSection({ filters: _filters }: Props) {
  const resources = mockMostBookedResources;

  const totalBookings = mockBookingTrend.reduce((s, m) => s + m.bookings, 0);
  const lastMonth = mockBookingTrend.at(-1)?.bookings ?? 0;
  const prevMonth = mockBookingTrend.at(-2)?.bookings ?? 1;
  const growth = Math.round(((lastMonth - prevMonth) / prevMonth) * 100);

  // Find peak hour across the heatmap
  const hourTotals = HOURS.map((h) => ({
    hour: h,
    total: mockBookingHeatmap.filter((c) => c.hour === h).reduce((s, c) => s + c.count, 0),
  }));
  const peakHour = hourTotals.sort((a, b) => b.total - a.total)[0]?.hour ?? "10am";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Booking Analytics</h2>
        <p className="text-sm text-muted-foreground">Resource booking patterns and peak usage analysis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Bookings (6 mo)", value: totalBookings, color: "text-blue-600" },
          { label: "Peak Hour (Weekly)",   value: peakHour,       color: "text-purple-600" },
          { label: "MoM Growth",           value: `${growth > 0 ? "+" : ""}${growth}%`, color: growth >= 0 ? "text-emerald-600" : "text-red-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Booking trend line chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Booking Volume</CardTitle>
          <CardDescription>Total bookings per month over 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockBookingTrend} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                name="Bookings"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Heatmap — Peak Hours by Day</CardTitle>
          <CardDescription>Colour intensity = booking density (Mon–Fri, 8am–6pm)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" role="region" aria-label="Booking heatmap by day and hour">
            <table className="w-full text-center text-xs">
              <thead>
                <tr>
                  <th className="w-10 text-muted-foreground font-normal pb-2"></th>
                  {HOURS.map((h) => (
                    <th key={h} className="font-medium text-muted-foreground pb-2 px-1">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td className="text-muted-foreground font-medium pr-2 py-1">{day}</td>
                    {HOURS.map((hour) => {
                      const cell = mockBookingHeatmap.find((c) => c.day === day && c.hour === hour);
                      const count = cell?.count ?? 0;
                      return (
                        <td key={hour} className="px-0.5 py-0.5">
                          <div
                            className={`rounded-md text-xs font-semibold h-8 w-full flex items-center justify-center ${heatColor(count)}`}
                            title={`${day} ${hour}: ${count} bookings`}
                          >
                            {count}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 justify-center text-xs text-muted-foreground flex-wrap">
            <span className="font-medium">Intensity:</span>
            {[
              { cls: "bg-slate-50 border border-slate-200",  label: "0–4"  },
              { cls: "bg-blue-100", label: "5–8"   },
              { cls: "bg-blue-300", label: "9–12"  },
              { cls: "bg-blue-500", label: "13–16" },
              { cls: "bg-blue-700", label: "17+"   },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1">
                <span className={`h-3 w-4 rounded-sm inline-block ${l.cls}`} />
                {l.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most booked resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Most Booked Resources</CardTitle>
          <CardDescription>Top resources by total bookings this period</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">MoM Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((r, i) => (
                <TableRow key={r.resource}>
                  <TableCell className="text-muted-foreground font-mono text-sm w-8">{i + 1}</TableCell>
                  <TableCell className="font-medium">{r.resource}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.category}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">{r.bookings}</span>
                  </TableCell>
                  <TableCell className="text-right"><TrendCell trend={r.trend} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
