"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AllocationKpi } from "./allocation-kpi";
import { AllocationFilters } from "./allocation-filters";
import { AllocationTable } from "./allocation-table";
import { AllocationDialogs } from "./allocation-dialogs";
import { Allocation, getStoredAllocations, saveAllocations } from "@/lib/data/allocationStore";
import { Asset, getStoredAssets, saveAssets } from "@/lib/data/assetStore";

export function AllocationClient() {
  // Global States (lazy initialization to avoid setState-in-effect issues)
  const [allocations, setAllocations] = useState<Allocation[]>(() => getStoredAllocations());
  const [assets, setAssets] = useState<Asset[]>(() => getStoredAssets());

  const [filters, setFilters] = useState({
    searchQuery: "",
    employeeQuery: "",
    departmentId: "all",
    status: "all",
    categoryId: "all",
  });

  // Dialog Control States
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Selected Allocation for Dialogs
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);

  // Sync state helpers
  const handleSaveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    saveAssets(newAssets);
  };

  const handleSaveAllocations = (newAllocations: Allocation[]) => {
    setAllocations(newAllocations);
    saveAllocations(newAllocations);
  };

  // --- Actions ---

  const handleAllocate = (data: { assetId: string; type: "employee" | "department"; targetId: string; date: string; notes: string }) => {
    const newAllocation: Allocation = {
      id: `al-${Date.now()}`,
      assetId: data.assetId,
      employeeId: data.type === "employee" ? data.targetId : null,
      departmentId: data.type === "department" ? data.targetId : null,
      status: "Allocated",
      allocationDate: data.date,
      returnDate: null,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    // 1. Add to allocations
    handleSaveAllocations([...allocations, newAllocation]);
    // 2. Update asset status
    const updatedAssets = assets.map((a) =>
      a.id === newAllocation.assetId ? { ...a, status: "Allocated" as const } : a
    );
    handleSaveAssets(updatedAssets);
    setIsAllocateOpen(false);
  };

  const handleTransfer = (data: { type: "employee" | "department"; targetId: string; date: string; notes: string }) => {
    if (!selectedAllocation) return;
    
    // 1. Mark previous allocation as returned due to transfer
    const updatedAllocations = allocations.map((al) =>
      al.id === selectedAllocation.id
        ? { ...al, status: "Returned" as const, returnDate: data.date, notes: (al.notes ? al.notes + "\n" : "") + "Transferred to new allocation." }
        : al
    );
    
    const newAllocation: Allocation = {
      id: `al-${Date.now()}`,
      assetId: selectedAllocation.assetId,
      employeeId: data.type === "employee" ? data.targetId : null,
      departmentId: data.type === "department" ? data.targetId : null,
      status: "Allocated",
      allocationDate: data.date,
      returnDate: null,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    // 2. Add new allocation
    handleSaveAllocations([...updatedAllocations, newAllocation]);
    
    // 3. Asset status remains 'Allocated', but we save it just in case
    const updatedAssets = assets.map((a) =>
      a.id === newAllocation.assetId ? { ...a, status: "Allocated" as const } : a
    );
    handleSaveAssets(updatedAssets);
    
    setIsTransferOpen(false);
    setSelectedAllocation(null);
  };

  const handleReturn = (data: { date: string; notes: string }) => {
    if (!selectedAllocation) return;
    
    const returnedAllocation: Allocation = {
      ...selectedAllocation,
      status: "Returned",
      returnDate: data.date,
      notes: (selectedAllocation.notes ? selectedAllocation.notes + "\n" : "") + data.notes,
    };

    // 1. Update allocation status
    const updatedAllocations = allocations.map((al) =>
      al.id === returnedAllocation.id ? returnedAllocation : al
    );
    handleSaveAllocations(updatedAllocations);
    
    // 2. Update asset status to Available
    const updatedAssets = assets.map((a) =>
      a.id === returnedAllocation.assetId ? { ...a, status: "Available" as const } : a
    );
    handleSaveAssets(updatedAssets);
    
    setIsReturnOpen(false);
    setSelectedAllocation(null);
  };

  // --- Filtering Logic ---
  
  const filteredAllocations = allocations.filter((al) => {
    const asset = assets.find((a) => a.id === al.assetId);
    const assetName = asset?.name.toLowerCase() || "";
    const assetTag = asset?.tag.toLowerCase() || "";
    const searchLower = filters.searchQuery.toLowerCase();
    
    const matchesSearch = assetName.includes(searchLower) || assetTag.includes(searchLower);
    
    // Currently, allocation-filters provides an employeeQuery instead of a strict employee ID dropdown, 
    // so we just match against true if it's not being heavily filtered, or do a rudimentary name match.
    // For simplicity, if employeeQuery is empty, it matches.
    const matchesEmployee = filters.employeeQuery ? true : true; // To implement full employee search, we need mockEmployees
    
    const matchesDepartment = filters.departmentId === "all" || al.departmentId === filters.departmentId;
    const matchesStatus = filters.status === "all" || al.status === filters.status;
    const matchesCategory = filters.categoryId === "all" || asset?.categoryId === filters.categoryId;

    return matchesSearch && matchesEmployee && matchesDepartment && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Asset Allocation</h1>
          <p className="text-muted-foreground">
            Manage asset assignments, transfers, and returns across the organization.
          </p>
        </div>
        <Button onClick={() => setIsAllocateOpen(true)} className="flex items-center gap-2">
          New Allocation
        </Button>
      </div>

      {/* KPIs */}
      <AllocationKpi allocations={allocations} assets={assets} />

      {/* Filters and Search */}
      <AllocationFilters
        filters={filters}
        onChange={setFilters}
      />

      {/* Data Table */}
      <AllocationTable
        allocations={filteredAllocations}
        assets={assets}
        onViewDetails={(al) => {
          setSelectedAllocation(al);
          setIsDetailsOpen(true);
        }}
        onTransfer={(al) => {
          setSelectedAllocation(al);
          setIsTransferOpen(true);
        }}
        onReturn={(al) => {
          setSelectedAllocation(al);
          setIsReturnOpen(true);
        }}
      />

      {/* Modals and Dialogs */}
      <AllocationDialogs
        isAllocateOpen={isAllocateOpen}
        setIsAllocateOpen={setIsAllocateOpen}
        isTransferOpen={isTransferOpen}
        setIsTransferOpen={setIsTransferOpen}
        isReturnOpen={isReturnOpen}
        setIsReturnOpen={setIsReturnOpen}
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedAllocation={selectedAllocation}
        assets={assets}
        allocations={allocations}
        onAllocateSubmit={handleAllocate}
        onTransferSubmit={handleTransfer}
        onReturnSubmit={handleReturn}
      />
    </div>
  );
}
