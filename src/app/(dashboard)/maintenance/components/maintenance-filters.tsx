"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, Search } from "lucide-react";

export interface MaintenanceFiltersState {
  searchQuery: string;
  priority: string;
  status: string;
  type: string;
}

interface MaintenanceFiltersProps {
  filters: MaintenanceFiltersState;
  onChange: (filters: MaintenanceFiltersState) => void;
}

export function MaintenanceFilters({ filters, onChange }: MaintenanceFiltersProps) {
  return (
    <div className="bg-card p-4 rounded-xl border space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters &amp; Search</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by request title, asset name..."
            className="pl-8 h-9 text-sm"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          />
        </div>
        <div>
          <Select
            value={filters.priority}
            onValueChange={(val) => val && onChange({ ...filters, priority: val })}
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Priority: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Priority: All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.status}
            onValueChange={(val) => val && onChange({ ...filters, status: val })}
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.type}
            onValueChange={(val) => val && onChange({ ...filters, type: val })}
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Type: All</SelectItem>
              <SelectItem value="Corrective">Corrective</SelectItem>
              <SelectItem value="Preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
