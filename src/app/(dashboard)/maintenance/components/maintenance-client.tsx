"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceKpi } from "./maintenance-kpi";
import { MaintenanceFilters, MaintenanceFiltersState } from "./maintenance-filters";
import { MaintenanceTable } from "./maintenance-table";
import { MaintenanceDialogs } from "./maintenance-dialogs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getStoredMaintenanceRequests, saveMaintenanceRequests, MaintenanceRequest, MaintenancePriority, MaintenanceType, MaintenanceStatus } from "@/lib/data/maintenanceStore";
import { getStoredAssets, saveAssets, Asset } from "@/lib/data/assetStore";
import { PlusCircle, Calendar, Wrench, ShieldCheck, PlayCircle } from "lucide-react";

export function MaintenanceClient() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(() => getStoredMaintenanceRequests());
  const [assets, setAssets] = useState<Asset[]>(() => getStoredAssets());

  const [filters, setFilters] = useState<MaintenanceFiltersState>({
    searchQuery: "",
    priority: "all",
    status: "all",
    type: "all",
  });

  // Dialog Controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Focus Elements
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [historyAssetId, setHistoryAssetId] = useState<string | null>(null);

  // Sync state helpers
  const handleSaveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    saveAssets(newAssets);
  };

  const handleSaveRequests = (newRequests: MaintenanceRequest[]) => {
    setRequests(newRequests);
    saveMaintenanceRequests(newRequests);
  };

  // --- Handlers ---
  
  const handleCreateRequest = (data: {
    assetId: string;
    title: string;
    description: string;
    type: MaintenanceType;
    priority: MaintenancePriority;
    nextServiceDate: string | null;
    cost: number;
    notes?: string;
  }) => {
    const newRequest: MaintenanceRequest = {
      id: `MR-${String(requests.length + 1).padStart(4, "0")}`,
      assetId: data.assetId,
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      status: "Open",
      cost: data.cost,
      requestDate: new Date().toISOString().split("T")[0],
      lastServiceDate: null,
      nextServiceDate: data.nextServiceDate,
      completionDate: null,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    handleSaveRequests([...requests, newRequest]);
    setIsCreateOpen(false);
  };

  const handleEditRequest = (id: string, data: {
    title: string;
    description: string;
    type: MaintenanceType;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    nextServiceDate: string | null;
    cost: number;
    notes?: string;
  }) => {
    const originalRequest = requests.find((r) => r.id === id);
    if (!originalRequest) return;

    const updatedRequest: MaintenanceRequest = {
      ...originalRequest,
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      status: data.status,
      nextServiceDate: data.nextServiceDate,
      cost: data.cost,
      notes: data.notes,
    };

    const newRequests = requests.map((r) => (r.id === id ? updatedRequest : r));
    handleSaveRequests(newRequests);

    // Sync Asset Status:
    // If transitioning to "In Progress", set asset to "Under Maintenance"
    // If transitioning away from "In Progress" (to Open/Overdue), set asset to "Available"
    const originalStatus = originalRequest.status;
    const newStatus = data.status;

    if (originalStatus !== "In Progress" && newStatus === "In Progress") {
      const updatedAssets = assets.map((a) =>
        a.id === originalRequest.assetId ? { ...a, status: "Under Maintenance" as const } : a
      );
      handleSaveAssets(updatedAssets);
    } else if (originalStatus === "In Progress" && newStatus !== "In Progress") {
      const updatedAssets = assets.map((a) =>
        a.id === originalRequest.assetId ? { ...a, status: "Available" as const } : a
      );
      handleSaveAssets(updatedAssets);
    }

    setIsEditOpen(false);
    setSelectedRequest(null);
  };

  const handleCloseRequest = (id: string, data: {
    completionDate: string;
    cost: number;
    notes?: string;
  }) => {
    const originalRequest = requests.find((r) => r.id === id);
    if (!originalRequest) return;

    // Get asset history to find last completed service date
    const assetHistory = requests.filter((r) => r.assetId === originalRequest.assetId && r.status === "Completed");
    const lastServiceDate = assetHistory.length > 0
      ? assetHistory.sort((a, b) => (b.completionDate || "").localeCompare(a.completionDate || ""))[0].completionDate
      : originalRequest.requestDate;

    const updatedRequest: MaintenanceRequest = {
      ...originalRequest,
      status: "Completed",
      cost: data.cost,
      completionDate: data.completionDate,
      lastServiceDate: lastServiceDate,
      notes: data.notes,
    };

    const newRequests = requests.map((r) => (r.id === id ? updatedRequest : r));
    handleSaveRequests(newRequests);

    // Revert Asset status back to Available
    const updatedAssets = assets.map((a) =>
      a.id === originalRequest.assetId ? { ...a, status: "Available" as const } : a
    );
    handleSaveAssets(updatedAssets);

    setIsCloseOpen(false);
    setSelectedRequest(null);
  };

  const handleQuickStartProgress = (request: MaintenanceRequest) => {
    // Directly move status to In Progress, update asset to Under Maintenance
    const updatedRequests = requests.map((r) =>
      r.id === request.id ? { ...r, status: "In Progress" as const } : r
    );
    handleSaveRequests(updatedRequests);

    const updatedAssets = assets.map((a) =>
      a.id === request.assetId ? { ...a, status: "Under Maintenance" as const } : a
    );
    handleSaveAssets(updatedAssets);
  };

  // --- Filtering Logic ---
  
  const filteredRequests = requests.filter((r) => {
    const asset = assets.find((a) => a.id === r.assetId);
    const assetName = asset?.name.toLowerCase() || "";
    const assetTag = asset?.tag.toLowerCase() || "";
    const titleLower = r.title.toLowerCase();
    const searchLower = filters.searchQuery.toLowerCase();

    const matchesSearch = assetName.includes(searchLower) || assetTag.includes(searchLower) || titleLower.includes(searchLower);
    
    // Evaluate overdue status dynamically
    let currentStatus = r.status;
    if (currentStatus !== "Completed" && r.nextServiceDate) {
      const today = new Date().toISOString().split("T")[0];
      if (r.nextServiceDate < today) {
        currentStatus = "Overdue";
      }
    }

    const matchesPriority = filters.priority === "all" || r.priority === filters.priority;
    const matchesStatus = filters.status === "all" || currentStatus === filters.status;
    const matchesType = filters.type === "all" || r.type === filters.type;

    return matchesSearch && matchesPriority && matchesStatus && matchesType;
  });

  // Schedule filtering (uncompleted preventive requests)
  const scheduledMaintenance = requests.filter((r) => {
    if (r.status === "Completed") return false;
    return r.type === "Preventive";
  });

  const getScheduledStatusBadge = (r: MaintenanceRequest) => {
    const today = new Date().toISOString().split("T")[0];
    if (r.nextServiceDate && r.nextServiceDate < today) {
      return <Badge variant="destructive" className="bg-red-600 border-none">Overdue</Badge>;
    }
    return <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50/50">Scheduled</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Maintenance Management</h1>
          <p className="text-muted-foreground">
            Schedule preventive inspections, process corrective repairs, and track maintenance costs.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> New Request
        </Button>
      </div>

      {/* KPI Cards */}
      <MaintenanceKpi requests={requests} />

      {/* Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="requests" className="flex items-center gap-1.5"><Wrench className="h-4 w-4" /> Service Requests</TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Preventive Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4 mt-4">
          {/* Filters */}
          <MaintenanceFilters filters={filters} onChange={setFilters} />

          {/* Table */}
          <MaintenanceTable
            requests={filteredRequests}
            assets={assets}
            onEdit={(r) => {
              setSelectedRequest(r);
              setIsEditOpen(true);
            }}
            onCloseRequest={(r) => {
              setSelectedRequest(r);
              setIsCloseOpen(true);
            }}
            onViewHistory={(assetId) => {
              setHistoryAssetId(assetId);
              setIsHistoryOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="p-4 bg-muted/20 border-b">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" /> Upcoming Preventive Maintenance Calendar
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">List of all scheduled inspections and cleaning events.</p>
            </div>
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Asset Tag &amp; Name</TableHead>
                  <TableHead className="font-semibold">Scheduled Task</TableHead>
                  <TableHead className="font-semibold">Last Serviced</TableHead>
                  <TableHead className="font-semibold">Next Service Due</TableHead>
                  <TableHead className="font-semibold">Current State</TableHead>
                  <TableHead className="font-semibold w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledMaintenance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <ShieldCheck className="h-8 w-8 text-emerald-500 mb-1" />
                        <p className="font-medium text-foreground">All systems serviced</p>
                        <p className="text-xs">No pending preventive maintenance tasks scheduled.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  scheduledMaintenance.map((r) => {
                    const asset = assets.find((a) => a.id === r.assetId);
                    return (
                      <TableRow key={r.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-xs text-muted-foreground">{asset?.tag}</span>
                            <span className="font-medium text-sm">{asset?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">{r.title}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{r.lastServiceDate ? new Date(r.lastServiceDate).toLocaleDateString() : "Never"}</TableCell>
                        <TableCell className="text-xs font-semibold text-foreground font-mono">{r.nextServiceDate ? new Date(r.nextServiceDate).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{getScheduledStatusBadge(r)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {r.status === "Open" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs flex items-center gap-1 border-amber-300 text-amber-700 bg-amber-50/50 hover:bg-amber-100/50 hover:text-amber-800"
                                onClick={() => handleQuickStartProgress(r)}
                              >
                                <PlayCircle className="h-3.5 w-3.5" /> Start Service
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs text-muted-foreground"
                              onClick={() => {
                                setHistoryAssetId(r.assetId);
                                setIsHistoryOpen(true);
                              }}
                            >
                              History
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs & Modals orchestrator */}
      <MaintenanceDialogs
        assets={assets}
        requests={requests}
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        onCreateSubmit={handleCreateRequest}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        selectedRequest={selectedRequest}
        onEditSubmit={handleEditRequest}
        isCloseOpen={isCloseOpen}
        setIsCloseOpen={setIsCloseOpen}
        onCloseSubmit={handleCloseRequest}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
        historyAssetId={historyAssetId}
      />
    </div>
  );
}
