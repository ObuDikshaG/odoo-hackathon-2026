"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ── Asset Utilization Bar Chart ───────────────────────────────────────────────

const utilizationData = [
  { department: "IT", utilized: 92, idle: 8 },
  { department: "HR", utilized: 74, idle: 26 },
  { department: "Finance", utilized: 88, idle: 12 },
  { department: "Ops", utilized: 65, idle: 35 },
  { department: "Sales", utilized: 81, idle: 19 },
  { department: "Legal", utilized: 58, idle: 42 },
];

const UTILIZED_COLOR = "hsl(221, 83%, 53%)";
const IDLE_COLOR = "hsl(221, 83%, 85%)";

export function AssetUtilizationChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={utilizationData}
        margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="department"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          unit="%"
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: 12,
          }}
          formatter={(value, name) => [
            `${value ?? 0}%`,
            name === "utilized" ? "Utilized" : "Idle",
          ]}
        />
        <Bar
          dataKey="utilized"
          stackId="a"
          fill={UTILIZED_COLOR}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="idle"
          stackId="a"
          fill={IDLE_COLOR}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AssetUtilizationLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
      <span className="flex items-center gap-1">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: UTILIZED_COLOR }}
        />
        Utilized
      </span>
      <span className="flex items-center gap-1">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ background: IDLE_COLOR }}
        />
        Idle
      </span>
    </div>
  );
}

// ── Assets by Category Pie Chart ──────────────────────────────────────────────

const pieData = [
  { name: "Laptops", value: 342, color: "hsl(221, 83%, 53%)" },
  { name: "Monitors", value: 198, color: "hsl(262, 80%, 58%)" },
  { name: "Printers", value: 87, color: "hsl(142, 71%, 45%)" },
  { name: "Servers", value: 54, color: "hsl(31, 90%, 54%)" },
  { name: "Networking", value: 73, color: "hsl(200, 80%, 48%)" },
  { name: "Other", value: 494, color: "hsl(215, 16%, 57%)" },
];

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

function renderCustomLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: LabelProps) {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function AssetsByCategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="45%"
          outerRadius={95}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: 12,
          }}
          formatter={(value, name) => [`${value ?? 0} assets`, String(name)]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Monthly Asset Growth Area Chart ───────────────────────────────────────────

const growthData = [
  { month: "Jan", assets: 1050 },
  { month: "Feb", assets: 1089 },
  { month: "Mar", assets: 1112 },
  { month: "Apr", assets: 1140 },
  { month: "May", assets: 1175 },
  { month: "Jun", assets: 1198 },
  { month: "Jul", assets: 1220 },
  { month: "Aug", assets: 1248 },
];

export function MonthlyGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={growthData}
        margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(221, 83%, 53%)"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="hsl(221, 83%, 53%)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          domain={[1000, 1300]}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: 12,
          }}
          formatter={(value) => [`${value ?? 0}`, "Total Assets"]}
        />
        <Area
          type="monotone"
          dataKey="assets"
          stroke="hsl(221, 83%, 53%)"
          strokeWidth={2}
          fill="url(#growthGradient)"
          dot={{ fill: "hsl(221, 83%, 53%)", r: 3 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
