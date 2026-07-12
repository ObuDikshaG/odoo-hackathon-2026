"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Asset } from "@/lib/data/assetStore";

export interface BookingFiltersState {
  searchQuery: string;
  status: string;
  assetId: string;
  dateFilter: string;
}

interface BookingFiltersProps {
  filters: BookingFiltersState;
  onChange: (filters: BookingFiltersState) => void;
  assets: Asset[];
}

export function BookingFilters({ filters, onChange, assets }: BookingFiltersProps) {
  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.status !== "all" ||
    filters.assetId !== "all" ||
    filters.dateFilter !== "";

  const handleClear = () => {
    onChange({
      searchQuery: "",
      status: "all",
      assetId: "all",
      dateFilter: "",
    });
  };

  return (
    <div className="bg-card p-4 rounded-xl border space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters &amp; Search</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, asset, purpose, person..."
            className="pl-8 h-9 text-sm"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          />
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Checked Out">Checked Out</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.assetId}
            onValueChange={(val) => val && onChange({ ...filters, assetId: val })}
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Asset: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Asset: All</SelectItem>
              {assets.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name} ({a.tag})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type="date"
            className="h-9 text-sm"
            value={filters.dateFilter}
            onChange={(e) => onChange({ ...filters, dateFilter: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
