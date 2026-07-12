"use client";

import { useState, useEffect } from "react";
import { getStoredAuditEntries, clearAuditEntries, AuditEntry } from "@/lib/data/auditStore";
import { AuditFilters } from "./audit-filters";
import { AuditTable } from "./audit-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, CalendarRange, AlertOctagon, Activity, Trash2 } from "lucide-react";

export function AuditClient() {
  const [entries, setEntries] = useState<AuditEntry[]>(() => getStoredAuditEntries());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isClearOpen, setIsClearOpen] = useState(false);

  // Load audit entries on mount
  useEffect(() => {
    // Listen to changes to storage
    const handleStorageChange = () => {
      setEntries(getStoredAuditEntries());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleClearLogs = () => {
    clearAuditEntries();
    setEntries([]);
    setIsClearOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedModule("all");
    setSelectedAction("all");
    setStartDate("");
    setEndDate("");
  };

  // Filter logs logic
  const filteredEntries = entries.filter((entry) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = entry.description.toLowerCase().includes(q);
      const matchId = entry.id.toLowerCase().includes(q);
      const matchUser = entry.performedByName.toLowerCase().includes(q) || entry.performedById.toLowerCase().includes(q);
      const matchAsset = entry.assetName?.toLowerCase().includes(q) || entry.assetTag?.toLowerCase().includes(q);
      if (!matchDesc && !matchId && !matchUser && !matchAsset) return false;
    }

    // 2. Module Filter
    if (selectedModule !== "all" && entry.module !== selectedModule) {
      return false;
    }

    // 3. Action Filter
    if (selectedAction !== "all" && entry.action !== selectedAction) {
      return false;
    }

    // 4. Date Filters
    if (startDate) {
      const entryTime = new Date(entry.timestamp).getTime();
      const startLimit = new Date(`${startDate}T00:00:00`).getTime();
      if (entryTime < startLimit) return false;
    }
    if (endDate) {
      const entryTime = new Date(entry.timestamp).getTime();
      const endLimit = new Date(`${endDate}T23:59:59`).getTime();
      if (entryTime > endLimit) return false;
    }

    return true;
  });

  // Calculate KPIs
  const totalLogs = entries.length;
  
  const todayStr = new Date().toISOString().split("T")[0];
  const actionsToday = entries.filter((entry) => {
    return entry.timestamp.startsWith(todayStr);
  }).length;

  const criticalActions = entries.filter((entry) => {
    const act = entry.action.toLowerCase();
    const desc = entry.description.toLowerCase();
    return (
      act.includes("delete") ||
      act.includes("retire") ||
      act.includes("dispose") ||
      act.includes("cancel") ||
      desc.includes("overdue")
    );
  }).length;

  const uniqueAssets = new Set(
    entries.filter((entry) => entry.assetId !== null).map((entry) => entry.assetId)
  ).size;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Trail Logs</h2>
          <p className="text-muted-foreground text-sm">
            Review detailed, unalterable system logs and operations history for compliance and tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={() => setIsClearOpen(true)}
            className="flex items-center gap-2 text-xs"
            disabled={entries.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear Logs
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Total Logged Events</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground">System-wide logged actions</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Actions Today</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionsToday}</div>
            <p className="text-xs text-muted-foreground">Operations executed today</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Critical Events</CardTitle>
            <AlertOctagon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalActions}</div>
            <p className="text-xs text-muted-foreground">Retirements, disposals, cancellations</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Unique Assets Audited</CardTitle>
            <CalendarRange className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueAssets}</div>
            <p className="text-xs text-muted-foreground">Assets with recorded audit trails</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table Section */}
      <AuditFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onClearFilters={handleClearFilters}
      />

      <AuditTable entries={filteredEntries} />

      {/* Clear Logs Dialog */}
      <Dialog open={isClearOpen} onOpenChange={setIsClearOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertOctagon className="h-5 w-5" />
              Confirm Clear Audit Logs
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all audit trail logs? This action is destructive and cannot be undone. In a real system, audit trails are immutable.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearLogs}>
              Clear All Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
