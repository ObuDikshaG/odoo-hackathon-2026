"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, Search } from "lucide-react";
import { mockCategories, mockDepartments } from "@/lib/data/mock";

export interface AllocationFiltersState {
  searchQuery: string;
  employeeQuery: string;
  departmentId: string;
  status: string;
  categoryId: string;
}

interface AllocationFiltersProps {
  filters: AllocationFiltersState;
  onChange: (filters: AllocationFiltersState) => void;
}

export function AllocationFilters({ filters, onChange }: AllocationFiltersProps) {
  return (
    <div className="bg-card p-4 rounded-xl border space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters &amp; Search</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Asset Name/Tag..."
            className="pl-8 h-9 text-sm"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Employee..."
            className="pl-8 h-9 text-sm"
            value={filters.employeeQuery}
            onChange={(e) => onChange({ ...filters, employeeQuery: e.target.value })}
          />
        </div>
        <div>
          <Select
            value={filters.departmentId}
            onValueChange={(val) => val && onChange({ ...filters, departmentId: val })}
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Department: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Department: All</SelectItem>
              {mockDepartments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
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
              <SelectItem value="Allocated">Allocated</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.categoryId}
            onValueChange={(val) => val && onChange({ ...filters, categoryId: val })}
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Category: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category: All</SelectItem>
              {mockCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
