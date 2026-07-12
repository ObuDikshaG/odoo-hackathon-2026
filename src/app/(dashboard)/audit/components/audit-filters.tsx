"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface AuditFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedModule: string;
  setSelectedModule: (val: string) => void;
  selectedAction: string;
  setSelectedAction: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  onClearFilters: () => void;
}

export function AuditFilters({
  searchQuery,
  setSearchQuery,
  selectedModule,
  setSelectedModule,
  selectedAction,
  setSelectedAction,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClearFilters
}: AuditFiltersProps) {
  const modules = ["Asset", "Allocation", "Maintenance", "Booking", "Organization"];
  const actions = ["Register", "Update", "Allocate", "Return", "Create Request", "Complete", "Status Change", "Create Booking", "Check Out", "Cancel"];

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by details, user, or asset tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <Select value={selectedModule} onValueChange={(val) => { if (val) setSelectedModule(val); }}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modules.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAction} onValueChange={(val) => { if (val) setSelectedAction(val); }}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actions.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-[130px] text-xs"
              placeholder="Start Date"
            />
            <span className="text-muted-foreground text-xs px-1">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-[130px] text-xs"
              placeholder="End Date"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onClearFilters}
            title="Reset Filters"
            className="h-9 w-9 sm:flex shrink-0 hidden"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full sm:hidden flex gap-2 items-center text-xs h-9 mt-1"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
