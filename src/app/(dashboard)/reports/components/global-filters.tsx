"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { mockDepartments, mockCategories } from "@/lib/data/mock";

export interface GlobalFilters {
  department: string;
  category: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface GlobalFilterBarProps {
  filters: GlobalFilters;
  onChange: (filters: GlobalFilters) => void;
}

export function GlobalFilterBar({ filters, onChange }: GlobalFilterBarProps) {
  const [open, setOpen] = useState(true);

  const resetFilters = () => {
    onChange({ department: "all", category: "all", status: "all", dateFrom: "", dateTo: "" });
  };

  const hasActive =
    filters.department !== "all" ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Global Filters</CardTitle>
            {hasActive && (
              <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActive && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs gap-1">
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} className="h-7 text-xs">
              {open ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Department</Label>
              <Select
                value={filters.department}
                onValueChange={(v) => v && onChange({ ...filters, department: v })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {mockDepartments.map((d) => (
                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(v) => v && onChange({ ...filters, category: v })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(v) => v && onChange({ ...filters, status: v })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From Date</Label>
              <Input
                type="date"
                className="h-8 text-sm"
                value={filters.dateFrom}
                onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">To Date</Label>
              <Input
                type="date"
                className="h-8 text-sm"
                value={filters.dateTo}
                onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
