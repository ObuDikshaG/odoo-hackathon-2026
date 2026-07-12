"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Asset } from "@/lib/data/assetStore";
import { MaintenanceRequest, MaintenancePriority, MaintenanceStatus, MaintenanceType } from "@/lib/data/maintenanceStore";
import { ShieldAlert, History, DollarSign, Activity } from "lucide-react";

interface MaintenanceDialogsProps {
  assets: Asset[];
  requests: MaintenanceRequest[];
  
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  onCreateSubmit: (data: {
    assetId: string;
    title: string;
    description: string;
    type: MaintenanceType;
    priority: MaintenancePriority;
    nextServiceDate: string | null;
    cost: number;
    notes?: string;
  }) => void;

  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  selectedRequest: MaintenanceRequest | null;
  onEditSubmit: (id: string, data: {
    title: string;
    description: string;
    type: MaintenanceType;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    nextServiceDate: string | null;
    cost: number;
    notes?: string;
  }) => void;

  isCloseOpen: boolean;
  setIsCloseOpen: (open: boolean) => void;
  onCloseSubmit: (id: string, data: {
    completionDate: string;
    cost: number;
    notes?: string;
  }) => void;

  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  historyAssetId: string | null;
}

export function MaintenanceDialogs({
  assets,
  requests,
  isCreateOpen,
  setIsCreateOpen,
  onCreateSubmit,
  isEditOpen,
  setIsEditOpen,
  selectedRequest,
  onEditSubmit,
  isCloseOpen,
  setIsCloseOpen,
  onCloseSubmit,
  isHistoryOpen,
  setIsHistoryOpen,
  historyAssetId,
}: MaintenanceDialogsProps) {
  // ── Create Request State ───────────────────────────────────────────────────
  const [createAssetId, setCreateAssetId] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createType, setCreateType] = useState<MaintenanceType>("Corrective");
  const [createPriority, setCreatePriority] = useState<MaintenancePriority>("Medium");
  const [createNextServiceDate, setCreateNextServiceDate] = useState("");
  const [createCost, setCreateCost] = useState("0");
  const [createNotes, setCreateNotes] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (isCreateOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreateAssetId("");
      setCreateTitle("");
      setCreateDescription("");
      setCreateType("Corrective");
      setCreatePriority("Medium");
      setCreateNextServiceDate("");
      setCreateCost("0");
      setCreateNotes("");
      setCreateError(null);
    }
  }, [isCreateOpen]);

  const handleCreate = () => {
    setCreateError(null);
    if (!createAssetId || createAssetId === "none") {
      setCreateError("Please select an asset.");
      return;
    }
    if (!createTitle.trim()) {
      setCreateError("Please enter a request title.");
      return;
    }
    if (parseFloat(createCost) < 0) {
      setCreateError("Estimated cost cannot be negative.");
      return;
    }

    // Check if the asset already has an active (Open / In Progress) request
    const activeRequest = requests.find(
      (r) => r.assetId === createAssetId && r.status !== "Completed"
    );
    if (activeRequest) {
      setCreateError("This asset already has an unresolved maintenance request.");
      return;
    }

    onCreateSubmit({
      assetId: createAssetId,
      title: createTitle,
      description: createDescription,
      type: createType,
      priority: createPriority,
      nextServiceDate: createNextServiceDate || null,
      cost: parseFloat(createCost) || 0,
      notes: createNotes,
    });
  };

  // ── Edit Request State ─────────────────────────────────────────────────────
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState<MaintenanceType>("Corrective");
  const [editPriority, setEditPriority] = useState<MaintenancePriority>("Medium");
  const [editStatus, setEditStatus] = useState<MaintenanceStatus>("Open");
  const [editNextServiceDate, setEditNextServiceDate] = useState("");
  const [editCost, setEditCost] = useState("0");
  const [editNotes, setEditNotes] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditOpen && selectedRequest) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditTitle(selectedRequest.title);
      setEditDescription(selectedRequest.description);
      setEditType(selectedRequest.type);
      setEditPriority(selectedRequest.priority);
      setEditStatus(selectedRequest.status);
      setEditNextServiceDate(selectedRequest.nextServiceDate || "");
      setEditCost(String(selectedRequest.cost));
      setEditNotes(selectedRequest.notes || "");
      setEditError(null);
    }
  }, [isEditOpen, selectedRequest]);

  const handleEdit = () => {
    setEditError(null);
    if (!editTitle.trim()) {
      setEditError("Please enter a request title.");
      return;
    }
    if (parseFloat(editCost) < 0) {
      setEditError("Cost cannot be negative.");
      return;
    }
    if (!selectedRequest) return;

    onEditSubmit(selectedRequest.id, {
      title: editTitle,
      description: editDescription,
      type: editType,
      priority: editPriority,
      status: editStatus,
      nextServiceDate: editNextServiceDate || null,
      cost: parseFloat(editCost) || 0,
      notes: editNotes,
    });
  };

  // ── Close Request State ────────────────────────────────────────────────────
  const [closeDate, setCloseDate] = useState(new Date().toISOString().split("T")[0]);
  const [closeCost, setCloseCost] = useState("0");
  const [closeNotes, setCloseNotes] = useState("");
  const [closeError, setCloseError] = useState<string | null>(null);

  useEffect(() => {
    if (isCloseOpen && selectedRequest) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCloseDate(new Date().toISOString().split("T")[0]);
      setCloseCost(String(selectedRequest.cost));
      setCloseNotes("");
      setCloseError(null);
    }
  }, [isCloseOpen, selectedRequest]);

  const handleClose = () => {
    setCloseError(null);
    if (!closeDate) {
      setCloseError("Please specify the completion date.");
      return;
    }
    if (parseFloat(closeCost) < 0) {
      setCloseError("Final cost cannot be negative.");
      return;
    }
    if (!selectedRequest) return;

    onCloseSubmit(selectedRequest.id, {
      completionDate: closeDate,
      cost: parseFloat(closeCost) || 0,
      notes: closeNotes,
    });
  };

  // ── History Calculations ───────────────────────────────────────────────────
  const historyAsset = historyAssetId ? assets.find((a) => a.id === historyAssetId) : null;
  const assetHistory = historyAssetId
    ? requests
        .filter((r) => r.assetId === historyAssetId && r.status === "Completed")
        .sort((a, b) => (b.completionDate || "").localeCompare(a.completionDate || ""))
    : [];

  const totalCost = assetHistory.reduce((sum, r) => sum + r.cost, 0);
  const totalServices = assetHistory.length;

  const formatCost = (amt: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt);
  };

  return (
    <>
      {/* ── Create Request Dialog ────────────────────────────────────────────── */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Maintenance Request</DialogTitle>
            <DialogDescription>Submit a new corrective or preventive maintenance request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {createError && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label>Asset <span className="text-destructive">*</span></Label>
              <Select value={createAssetId} onValueChange={(val) => val && setCreateAssetId(val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Asset for Service" />
                </SelectTrigger>
                <SelectContent>
                  {assets.filter((a) => a.status !== "Retired" && a.status !== "Disposed").map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({a.tag}) — {a.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="create-title">Request Title <span className="text-destructive">*</span></Label>
              <Input
                id="create-title"
                placeholder="e.g. Annual Fan Cleaning / Screen Repair"
                className="h-9"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="create-desc">Description</Label>
              <Input
                id="create-desc"
                placeholder="Enter details about the issue or task..."
                className="h-9"
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Maintenance Type</Label>
              <RadioGroup
                value={createType}
                onValueChange={(val: MaintenanceType) => setCreateType(val)}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Corrective" id="type-corr" />
                  <Label htmlFor="type-corr" className="font-normal cursor-pointer">Corrective (Repair)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Preventive" id="type-prev" />
                  <Label htmlFor="type-prev" className="font-normal cursor-pointer">Preventive (Scheduled)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>Priority</Label>
                <Select value={createPriority} onValueChange={(val) => val && setCreatePriority(val as MaintenancePriority)}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="create-cost">Estimated Cost ($)</Label>
                <Input
                  id="create-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  className="h-9"
                  value={createCost}
                  onChange={(e) => setCreateCost(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="create-date">Scheduled Service Date</Label>
              <Input
                id="create-date"
                type="date"
                className="h-9"
                value={createNextServiceDate}
                onChange={(e) => setCreateNextServiceDate(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="create-notes">Preparatory Notes</Label>
              <Input
                id="create-notes"
                placeholder="Optional notes or instructions..."
                className="h-9"
                value={createNotes}
                onChange={(e) => setCreateNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Request Dialog ──────────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Request</DialogTitle>
            <DialogDescription>Modify request details and track status workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {editError && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="edit-title">Request Title <span className="text-destructive">*</span></Label>
              <Input
                id="edit-title"
                className="h-9"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-desc">Description</Label>
              <Input
                id="edit-desc"
                className="h-9"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Maintenance Type</Label>
              <RadioGroup
                value={editType}
                onValueChange={(val: MaintenanceType) => setEditType(val)}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Corrective" id="edit-type-corr" />
                  <Label htmlFor="edit-type-corr" className="font-normal cursor-pointer">Corrective</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Preventive" id="edit-type-prev" />
                  <Label htmlFor="edit-type-prev" className="font-normal cursor-pointer">Preventive</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>Priority</Label>
                <Select value={editPriority} onValueChange={(val) => val && setEditPriority(val as MaintenancePriority)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label>Workflow Status</Label>
                <Select value={editStatus} onValueChange={(val) => val && setEditStatus(val as MaintenanceStatus)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Completed" disabled>Completed (Use Close Menu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="edit-cost">Cost ($)</Label>
                <Input
                  id="edit-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  className="h-9"
                  value={editCost}
                  onChange={(e) => setEditCost(e.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="edit-date">Scheduled Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  className="h-9"
                  value={editNextServiceDate}
                  onChange={(e) => setEditNextServiceDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-notes">Internal Notes</Label>
              <Input
                id="edit-notes"
                className="h-9"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>
            
            {editStatus === "Completed" && (
              <p className="text-xs text-muted-foreground italic border-t pt-2">
                This is a closed request. Work completed details can only be viewed in History logs.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Close Request Dialog ─────────────────────────────────────────────── */}
      <Dialog open={isCloseOpen} onOpenChange={setIsCloseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close Maintenance Request</DialogTitle>
            <DialogDescription>Mark servicing task as Completed and update asset status.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {closeError && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{closeError}</span>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="close-date">Work Completion Date <span className="text-destructive">*</span></Label>
              <Input
                id="close-date"
                type="date"
                className="h-9"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="close-cost">Final Service Cost ($) <span className="text-destructive">*</span></Label>
              <Input
                id="close-cost"
                type="number"
                min="0"
                step="0.01"
                className="h-9"
                value={closeCost}
                onChange={(e) => setCloseCost(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="close-notes">Service Resolution Notes</Label>
              <Input
                id="close-notes"
                placeholder="Details on parts replaced, servicing firm, warranty info..."
                className="h-9"
                value={closeNotes}
                onChange={(e) => setCloseNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseOpen(false)}>Cancel</Button>
            <Button onClick={handleClose} className="bg-emerald-600 hover:bg-emerald-700 text-white border-none">Complete Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View History Dialog ──────────────────────────────────────────────── */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-600" /> Maintenance Audit History
            </DialogTitle>
            <DialogDescription>Full servicing logs for the selected asset.</DialogDescription>
          </DialogHeader>
          
          {historyAsset && (
            <div className="space-y-6 py-2">
              <div className="border rounded-xl p-4 bg-muted/20 grid grid-cols-2 gap-4 text-xs">
                <div className="col-span-2">
                  <span className="font-mono font-bold text-muted-foreground">{historyAsset.tag}</span>
                  <h3 className="font-bold text-base mt-0.5">{historyAsset.name}</h3>
                </div>
                <div className="border-t pt-2">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5" /> Total Repairs
                  </p>
                  <p className="text-lg font-bold mt-0.5">{totalServices} times</p>
                </div>
                <div className="border-t pt-2">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" /> Cumulative Cost
                  </p>
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">{formatCost(totalCost)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Service Timeline</h4>
                <div className="space-y-3 border-l-2 border-muted pl-4 ml-2">
                  {assetHistory.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic pl-2">No historical servicing entries completed for this asset.</p>
                  ) : (
                    assetHistory.map((h) => (
                      <div key={h.id} className="relative space-y-1">
                        {/* Dot on timeline */}
                        <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-foreground">{h.title}</span>
                          <span className="font-mono text-muted-foreground">{h.completionDate ? new Date(h.completionDate).toLocaleDateString() : "-"}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{h.description}</p>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-0.5">
                          <span>Cost: <strong className="text-foreground font-mono">{formatCost(h.cost)}</strong></span>
                          <span>Type: <strong className="text-foreground">{h.type}</strong></span>
                        </div>
                        {h.notes && (
                          <p className="text-[10px] text-emerald-700 bg-emerald-50/50 p-1.5 rounded italic">
                            Result: &quot;{h.notes}&quot;
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
