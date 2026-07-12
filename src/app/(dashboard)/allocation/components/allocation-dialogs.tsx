"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Asset } from "@/lib/data/assetStore";
import { Allocation } from "@/lib/data/allocationStore";
import { mockCategories, mockDepartments, mockEmployees } from "@/lib/data/mock";
import { ShieldAlert, History, User, Building } from "lucide-react";

interface AllocationDialogsProps {
  assets: Asset[];
  allocations: Allocation[];
  
  isAllocateOpen: boolean;
  setIsAllocateOpen: (open: boolean) => void;
  onAllocateSubmit: (data: { assetId: string; type: "employee" | "department"; targetId: string; date: string; notes: string }) => void;
  
  isTransferOpen: boolean;
  setIsTransferOpen: (open: boolean) => void;
  selectedAllocation: Allocation | null;
  onTransferSubmit: (data: { type: "employee" | "department"; targetId: string; date: string; notes: string }) => void;

  isReturnOpen: boolean;
  setIsReturnOpen: (open: boolean) => void;
  onReturnSubmit: (data: { date: string; notes: string }) => void;

  isDetailsOpen: boolean;
  setIsDetailsOpen: (open: boolean) => void;
}

export function AllocationDialogs({
  assets,
  allocations,
  isAllocateOpen,
  setIsAllocateOpen,
  onAllocateSubmit,
  isTransferOpen,
  setIsTransferOpen,
  selectedAllocation,
  onTransferSubmit,
  isReturnOpen,
  setIsReturnOpen,
  onReturnSubmit,
  isDetailsOpen,
  setIsDetailsOpen,
}: AllocationDialogsProps) {
  // ── Allocate Form State ───────────────────────────────────────────────────────
  const [allocateAssetId, setAllocateAssetId] = useState("");
  const [allocateType, setAllocateType] = useState<"employee" | "department">("employee");
  const [allocateTargetId, setAllocateTargetId] = useState("");
  const [allocateDate, setAllocateDate] = useState(new Date().toISOString().split("T")[0]);
  const [allocateNotes, setAllocateNotes] = useState("");
  const [allocateError, setAllocateError] = useState<string | null>(null);

  // Filter available assets
  const availableAssets = assets.filter((a) => a.status === "Available");

  // Reset allocate form
  useEffect(() => {
    if (isAllocateOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllocateAssetId("");
      setAllocateType("employee");
      setAllocateTargetId("");
      setAllocateDate(new Date().toISOString().split("T")[0]);
      setAllocateNotes("");
      setAllocateError(null);
    }
  }, [isAllocateOpen]);

  const handleAllocate = () => {
    setAllocateError(null);
    if (!allocateAssetId) {
      setAllocateError("Please select an asset to allocate.");
      return;
    }
    if (!allocateTargetId || allocateTargetId === "none") {
      setAllocateError(`Please select a target ${allocateType} for allocation.`);
      return;
    }
    if (!allocateDate) {
      setAllocateError("Please specify allocation date.");
      return;
    }

    const selectedAsset = assets.find((a) => a.id === allocateAssetId);
    if (selectedAsset?.status !== "Available") {
      setAllocateError("The selected asset is already allocated or unavailable.");
      return;
    }

    // Double employee assignment check
    if (allocateType === "employee") {
      const activeEmployeeAllocation = allocations.find(
        (al) => al.employeeId === allocateTargetId && al.assetId === allocateAssetId && al.status !== "Returned"
      );
      if (activeEmployeeAllocation) {
        setAllocateError("This employee already holds this asset.");
        return;
      }
    } else {
      // Double department assignment check
      const activeDeptAllocation = allocations.find(
        (al) => al.departmentId === allocateTargetId && al.assetId === allocateAssetId && al.status !== "Returned"
      );
      if (activeDeptAllocation) {
        setAllocateError("This department already holds an active allocation for this asset.");
        return;
      }
    }

    onAllocateSubmit({
      assetId: allocateAssetId,
      type: allocateType,
      targetId: allocateTargetId,
      date: allocateDate,
      notes: allocateNotes,
    });
  };

  // ── Transfer Form State ────────────────────────────────────────────────────────
  const [transferType, setTransferType] = useState<"employee" | "department">("employee");
  const [transferTargetId, setTransferTargetId] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0]);
  const [transferNotes, setTransferNotes] = useState("");
  const [transferError, setTransferError] = useState<string | null>(null);

  useEffect(() => {
    if (isTransferOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransferType("employee");
      setTransferTargetId("");
      setTransferDate(new Date().toISOString().split("T")[0]);
      setTransferNotes("");
      setTransferError(null);
    }
  }, [isTransferOpen]);

  const handleTransfer = () => {
    setTransferError(null);
    if (!transferTargetId || transferTargetId === "none") {
      setTransferError(`Please select a transfer recipient ${transferType}.`);
      return;
    }
    if (!transferDate) {
      setTransferError("Please specify transfer date.");
      return;
    }
    if (!selectedAllocation) return;

    const asset = assets.find((a) => a.id === selectedAllocation.assetId);
    if (asset?.status !== "Allocated") {
      setTransferError("This asset is currently not active in an allocation and cannot be transferred.");
      return;
    }

    // Check same recipient check
    if (transferType === "employee" && selectedAllocation.employeeId === transferTargetId) {
      setTransferError("Cannot transfer an asset to the same employee currently holding it.");
      return;
    }
    if (transferType === "department" && selectedAllocation.departmentId === transferTargetId) {
      setTransferError("Cannot transfer an asset to the same department currently holding it.");
      return;
    }

    onTransferSubmit({
      type: transferType,
      targetId: transferTargetId,
      date: transferDate,
      notes: transferNotes,
    });
  };

  // ── Return Form State ──────────────────────────────────────────────────────────
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnNotes, setReturnNotes] = useState("");
  const [returnError, setReturnError] = useState<string | null>(null);

  useEffect(() => {
    if (isReturnOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReturnDate(new Date().toISOString().split("T")[0]);
      setReturnNotes("");
      setReturnError(null);
    }
  }, [isReturnOpen]);

  const handleReturn = () => {
    setReturnError(null);
    if (!returnDate) {
      setReturnError("Please specify the return date.");
      return;
    }
    if (!selectedAllocation) return;

    if (selectedAllocation.status === "Returned") {
      setReturnError("This asset has already been returned.");
      return;
    }

    onReturnSubmit({
      date: returnDate,
      notes: returnNotes,
    });
  };

  // ── Details Calculations ───────────────────────────────────────────────────────
  const detailedAsset = selectedAllocation ? assets.find((a) => a.id === selectedAllocation.assetId) : null;
  const assetHistory = selectedAllocation 
    ? allocations.filter((al) => al.assetId === selectedAllocation.assetId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "-";
    return mockCategories.find((c) => c.id === categoryId)?.name || "-";
  };

  const getEmployeeName = (employeeId: string | null) => {
    if (!employeeId) return "-";
    return mockEmployees.find((e) => e.id === employeeId)?.name || "-";
  };

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return "-";
    return mockDepartments.find((d) => d.id === deptId)?.name || "-";
  };

  return (
    <>
      {/* ── Allocate Dialog ────────────────────────────────────────────────────── */}
      <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate Asset</DialogTitle>
            <DialogDescription>Assign an available asset to a team member or department.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {allocateError && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{allocateError}</span>
              </div>
            )}
            
            <div className="grid gap-1.5">
              <Label>Asset <span className="text-destructive">*</span></Label>
              <Select value={allocateAssetId} onValueChange={(val) => val && setAllocateAssetId(val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Available Asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.length === 0 ? (
                    <SelectItem value="none" disabled>No available assets in directory</SelectItem>
                  ) : (
                    availableAssets.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name} ({a.tag})</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Allocation Type</Label>
              <RadioGroup
                value={allocateType}
                onValueChange={(val: "employee" | "department") => {
                  setAllocateType(val);
                  setAllocateTargetId("");
                }}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employee" id="type-emp" />
                  <Label htmlFor="type-emp" className="font-normal cursor-pointer flex items-center gap-1"><User className="h-3.5 w-3.5" /> Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="department" id="type-dept" />
                  <Label htmlFor="type-dept" className="font-normal cursor-pointer flex items-center gap-1"><Building className="h-3.5 w-3.5" /> Department</Label>
                </div>
              </RadioGroup>
            </div>

            {allocateType === "employee" ? (
              <div className="grid gap-1.5">
                <Label>Assignee Employee <span className="text-destructive">*</span></Label>
                <Select value={allocateTargetId} onValueChange={(val) => val && setAllocateTargetId(val)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name} ({e.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-1.5">
                <Label>Assignee Department <span className="text-destructive">*</span></Label>
                <Select value={allocateTargetId} onValueChange={(val) => val && setAllocateTargetId(val)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="allocate-date">Allocation Date <span className="text-destructive">*</span></Label>
              <Input
                id="allocate-date"
                type="date"
                className="h-9"
                value={allocateDate}
                onChange={(e) => setAllocateDate(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="allocate-notes">Notes / Purpose</Label>
              <Input
                id="allocate-notes"
                placeholder="Optional assignment instructions..."
                value={allocateNotes}
                onChange={(e) => setAllocateNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocateOpen(false)}>Cancel</Button>
            <Button onClick={handleAllocate}>Allocate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Transfer Dialog ────────────────────────────────────────────────────── */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Asset</DialogTitle>
            <DialogDescription>Reassign this asset to a new employee or department.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {transferError && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{transferError}</span>
              </div>
            )}
            
            <div className="bg-muted/40 p-3 rounded-lg border text-xs">
              <p className="font-semibold text-foreground">Current Assignment</p>
              {selectedAllocation?.employeeId ? (
                <p className="text-muted-foreground mt-0.5">Employee: {getEmployeeName(selectedAllocation.employeeId)}</p>
              ) : (
                <p className="text-muted-foreground mt-0.5">Department: {getDepartmentName(selectedAllocation?.departmentId ?? null)}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label>Transfer Destination Type</Label>
              <RadioGroup
                value={transferType}
                onValueChange={(val: "employee" | "department") => {
                  setTransferType(val);
                  setTransferTargetId("");
                }}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employee" id="trans-emp" />
                  <Label htmlFor="trans-emp" className="font-normal cursor-pointer flex items-center gap-1"><User className="h-3.5 w-3.5" /> Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="department" id="trans-dept" />
                  <Label htmlFor="trans-dept" className="font-normal cursor-pointer flex items-center gap-1"><Building className="h-3.5 w-3.5" /> Department</Label>
                </div>
              </RadioGroup>
            </div>

            {transferType === "employee" ? (
              <div className="grid gap-1.5">
                <Label>New Employee Recipient <span className="text-destructive">*</span></Label>
                <Select value={transferTargetId} onValueChange={(val) => val && setTransferTargetId(val)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Recipient Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name} ({e.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-1.5">
                <Label>New Department Recipient <span className="text-destructive">*</span></Label>
                <Select value={transferTargetId} onValueChange={(val) => val && setTransferTargetId(val)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Recipient Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="transfer-date">Transfer Date <span className="text-destructive">*</span></Label>
              <Input
                id="transfer-date"
                type="date"
                className="h-9"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="transfer-notes">Transfer Notes</Label>
              <Input
                id="transfer-notes"
                placeholder="Optional transfer remarks..."
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferOpen(false)}>Cancel</Button>
            <Button onClick={handleTransfer}>Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Return Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Return Asset</DialogTitle>
            <DialogDescription>Mark this asset as returned to inventory. Its status will update to &quot;Available&quot;.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {returnError && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{returnError}</span>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="return-date">Return Date <span className="text-destructive">*</span></Label>
              <Input
                id="return-date"
                type="date"
                className="h-9"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="return-notes">Return Remarks</Label>
              <Input
                id="return-notes"
                placeholder="Optional return inspection details..."
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnOpen(false)}>Cancel</Button>
            <Button onClick={handleReturn} variant="destructive">Return Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Details & History Dialog ────────────────────────────────────────── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Allocation &amp; Asset History</DialogTitle>
            <DialogDescription>Full audit trail of asset assignments.</DialogDescription>
          </DialogHeader>
          
          {selectedAllocation && detailedAsset && (
            <div className="space-y-6 py-2">
              {/* Asset specifications card */}
              <div className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold font-mono text-muted-foreground">{detailedAsset.tag}</span>
                  <span className="font-semibold text-primary">{getCategoryName(detailedAsset.categoryId)}</span>
                </div>
                <h3 className="font-bold text-base">{detailedAsset.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{detailedAsset.description || "No description provided."}</p>
              </div>

              {/* Current allocation properties */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Details</h4>
                <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg text-xs bg-card">
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {selectedAllocation.employeeId 
                        ? `Employee: ${getEmployeeName(selectedAllocation.employeeId)}`
                        : `Department: ${getDepartmentName(selectedAllocation.departmentId)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Allocation Date</p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {new Date(selectedAllocation.allocationDate).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedAllocation.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Allocation Notes</p>
                      <p className="font-medium text-foreground mt-0.5">{selectedAllocation.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Allocation History Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <History className="h-3.5 w-3.5" /> Assignment Audit History
                </h4>
                <div className="border rounded-lg divide-y bg-card text-xs">
                  {assetHistory.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground italic">No historical records.</div>
                  ) : (
                    assetHistory.map((h) => (
                      <div key={h.id} className="p-3 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            {h.employeeId ? getEmployeeName(h.employeeId) : getDepartmentName(h.departmentId)}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            h.status === "Allocated" ? "bg-blue-100 text-blue-800" :
                            h.status === "Returned" ? "bg-emerald-100 text-emerald-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[10px] flex justify-between">
                          <span>Assigned: {new Date(h.allocationDate).toLocaleDateString()}</span>
                          {h.returnDate && <span>Returned: {new Date(h.returnDate).toLocaleDateString()}</span>}
                        </p>
                        {h.notes && <p className="text-muted-foreground text-[10px] italic mt-0.5">Note: &quot;{h.notes}&quot;</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
