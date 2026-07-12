"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Booking, BookingStatus, hasBookingConflict } from "@/lib/data/bookingStore";
import { Asset } from "@/lib/data/assetStore";
import { mockEmployees } from "@/lib/data/mock";
import { ShieldAlert, Info, CalendarRange, Clock, User, FileText, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookingDialogsProps {
  assets: Asset[];
  bookings: Booking[];
  
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  onCreateSubmit: (data: {
    assetId: string;
    bookedById: string;
    purpose: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    notes?: string;
  }) => void;

  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  selectedBooking: Booking | null;
  onEditSubmit: (id: string, data: {
    purpose: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    notes?: string;
  }) => void;

  isDetailsOpen: boolean;
  setIsDetailsOpen: (open: boolean) => void;
  
  isConfirmOpen: boolean;
  setIsConfirmOpen: (open: boolean) => void;
  
  isCheckOutOpen: boolean;
  setIsCheckOutOpen: (open: boolean) => void;
  
  isReturnOpen: boolean;
  setIsReturnOpen: (open: boolean) => void;
  
  onStatusSubmit: (id: string, newStatus: BookingStatus, data?: { date: string; notes?: string }) => void;

  prefill?: { assetId: string; dateStr: string } | null;
}

export function BookingDialogs({
  assets,
  bookings,
  isCreateOpen,
  setIsCreateOpen,
  onCreateSubmit,
  isEditOpen,
  setIsEditOpen,
  selectedBooking,
  onEditSubmit,
  isDetailsOpen,
  setIsDetailsOpen,
  isConfirmOpen,
  setIsConfirmOpen,
  isCheckOutOpen,
  setIsCheckOutOpen,
  isReturnOpen,
  setIsReturnOpen,
  onStatusSubmit,
  prefill,
}: BookingDialogsProps) {
  // ── Create Booking Form State ──────────────────────────────────────────────
  const [createAssetId, setCreateAssetId] = useState("");
  const [createBookedById, setCreateBookedById] = useState("");
  const [createPurpose, setCreatePurpose] = useState("");
  const [createStartDate, setCreateStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [createStartTime, setCreateStartTime] = useState("09:00");
  const [createEndDate, setCreateEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [createEndTime, setCreateEndTime] = useState("17:00");
  const [createNotes, setCreateNotes] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (isCreateOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreateAssetId(prefill?.assetId || "");
      setCreateBookedById("");
      setCreatePurpose("");
      setCreateStartDate(prefill?.dateStr || new Date().toISOString().split("T")[0]);
      setCreateStartTime("09:00");
      setCreateEndDate(prefill?.dateStr || new Date().toISOString().split("T")[0]);
      setCreateEndTime("17:00");
      setCreateNotes("");
      setCreateError(null);
    }
  }, [isCreateOpen, prefill]);

  const handleCreate = () => {
    setCreateError(null);
    if (!createAssetId) {
      setCreateError("Please select an asset.");
      return;
    }
    if (!createBookedById) {
      setCreateError("Please select the employee reserving the asset.");
      return;
    }
    if (!createPurpose.trim()) {
      setCreateError("Please describe the booking purpose.");
      return;
    }
    if (!createStartDate || !createStartTime || !createEndDate || !createEndTime) {
      setCreateError("Please specify schedule dates and times.");
      return;
    }

    const startDateTime = new Date(`${createStartDate}T${createStartTime}`).getTime();
    const endDateTime = new Date(`${createEndDate}T${createEndTime}`).getTime();

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      setCreateError("Invalid date or time formats.");
      return;
    }

    if (endDateTime <= startDateTime) {
      setCreateError("End date/time must be after start date/time.");
      return;
    }

    // Check conflict
    const conflict = hasBookingConflict(
      bookings,
      createAssetId,
      createStartDate,
      createStartTime,
      createEndDate,
      createEndTime
    );

    if (conflict) {
      setCreateError("Conflict detected! This asset is already reserved during the selected time slot.");
      return;
    }

    onCreateSubmit({
      assetId: createAssetId,
      bookedById: createBookedById,
      purpose: createPurpose,
      startDate: createStartDate,
      startTime: createStartTime,
      endDate: createEndDate,
      endTime: createEndTime,
      notes: createNotes,
    });
  };

  // ── Edit Booking Form State ────────────────────────────────────────────────
  const [editPurpose, setEditPurpose] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditOpen && selectedBooking) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditPurpose(selectedBooking.purpose);
      setEditStartDate(selectedBooking.startDate);
      setEditStartTime(selectedBooking.startTime);
      setEditEndDate(selectedBooking.endDate);
      setEditEndTime(selectedBooking.endTime);
      setEditNotes(selectedBooking.notes || "");
      setEditError(null);
    }
  }, [isEditOpen, selectedBooking]);

  const handleEdit = () => {
    setEditError(null);
    if (!selectedBooking) return;
    if (!editPurpose.trim()) {
      setEditError("Please enter the booking purpose.");
      return;
    }

    const startDateTime = new Date(`${editStartDate}T${editStartTime}`).getTime();
    const endDateTime = new Date(`${editEndDate}T${editEndTime}`).getTime();

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      setEditError("Invalid date/time inputs.");
      return;
    }

    if (endDateTime <= startDateTime) {
      setEditError("End schedule must be strictly after start schedule.");
      return;
    }

    // Check conflict (excluding this booking itself)
    const conflict = hasBookingConflict(
      bookings,
      selectedBooking.assetId,
      editStartDate,
      editStartTime,
      editEndDate,
      editEndTime,
      selectedBooking.id
    );

    if (conflict) {
      setEditError("Conflict detected! Another reservation is scheduled during this time slot.");
      return;
    }

    onEditSubmit(selectedBooking.id, {
      purpose: editPurpose,
      startDate: editStartDate,
      startTime: editStartTime,
      endDate: editEndDate,
      endTime: editEndTime,
      notes: editNotes,
    });
  };

  // ── Checkout & Return Status Transitions Form State ─────────────────────────
  const [transitionDate, setTransitionDate] = useState("");
  const [transitionNotes, setTransitionNotes] = useState("");

  useEffect(() => {
    if (isCheckOutOpen || isReturnOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransitionDate(new Date().toISOString().split("T")[0]);
      setTransitionNotes("");
    }
  }, [isCheckOutOpen, isReturnOpen]);

  const handleStatusTransition = (status: BookingStatus) => {
    if (!selectedBooking) return;
    onStatusSubmit(selectedBooking.id, status, {
      date: transitionDate,
      notes: transitionNotes,
    });
  };

  // ── Details Calculations ───────────────────────────────────────────────────
  const detailedAsset = selectedBooking ? assets.find((a) => a.id === selectedBooking.assetId) : null;
  const detailedEmployee = selectedBooking ? mockEmployees.find((e) => e.id === selectedBooking.bookedById) : null;
  
  // Chronological booking history chain for the selected asset
  const assetBookingsChain = selectedBooking
    ? bookings
        .filter((b) => b.assetId === selectedBooking.assetId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  const getEmployeeName = (id: string) => {
    return mockEmployees.find((e) => e.id === id)?.name || "Unknown";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* ── Create Booking Dialog ────────────────────────────────────────────── */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve Asset</DialogTitle>
            <DialogDescription>Book an available device or facility for a future slot.</DialogDescription>
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
                  <SelectValue placeholder="Select Asset to Reserve" />
                </SelectTrigger>
                <SelectContent>
                  {assets.filter((a) => a.status !== "Retired" && a.status !== "Disposed").map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({a.tag}) {a.status !== "Available" ? `— [${a.status}]` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Reserved By <span className="text-destructive">*</span></Label>
              <Select value={createBookedById} onValueChange={(val) => val && setCreateBookedById(val)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name} ({e.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="create-purpose">Purpose <span className="text-destructive">*</span></Label>
              <Input
                id="create-purpose"
                placeholder="e.g. Field team diagnostics / Presentation demo"
                className="h-9"
                value={createPurpose}
                onChange={(e) => setCreatePurpose(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="create-start-date">Start Date <span className="text-destructive">*</span></Label>
                <Input
                  id="create-start-date"
                  type="date"
                  className="h-9 text-xs"
                  value={createStartDate}
                  onChange={(e) => setCreateStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="create-start-time">Start Time <span className="text-destructive">*</span></Label>
                <Input
                  id="create-start-time"
                  type="time"
                  className="h-9 text-xs font-mono"
                  value={createStartTime}
                  onChange={(e) => setCreateStartTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="create-end-date">End Date <span className="text-destructive">*</span></Label>
                <Input
                  id="create-end-date"
                  type="date"
                  className="h-9 text-xs"
                  value={createEndDate}
                  onChange={(e) => setCreateEndDate(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="create-end-time">End Time <span className="text-destructive">*</span></Label>
                <Input
                  id="create-end-time"
                  type="time"
                  className="h-9 text-xs font-mono"
                  value={createEndTime}
                  onChange={(e) => setCreateEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="create-notes">Reservation Notes</Label>
              <Input
                id="create-notes"
                placeholder="Optional notes or additional accessory requests..."
                className="h-9"
                value={createNotes}
                onChange={(e) => setCreateNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Book Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Booking Dialog ──────────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
            <DialogDescription>Modify scheduling slot parameters or notes.</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-2">
              {editError && (
                <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="bg-muted/40 p-3 rounded-lg border text-xs space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1">
                  <CalendarRange className="h-3.5 w-3.5" /> Booked Asset Details
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Asset: <strong className="text-foreground">{detailedAsset?.name} ({detailedAsset?.tag})</strong>
                </p>
                <p className="text-muted-foreground">
                  Reserved by: <strong className="text-foreground">{detailedEmployee?.name}</strong>
                </p>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="edit-purpose">Purpose <span className="text-destructive">*</span></Label>
                <Input
                  id="edit-purpose"
                  className="h-9"
                  value={editPurpose}
                  onChange={(e) => setEditPurpose(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="edit-start-date">Start Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    className="h-9 text-xs"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="edit-start-time">Start Time <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-start-time"
                    type="time"
                    className="h-9 text-xs font-mono"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="edit-end-date">End Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    className="h-9 text-xs"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="edit-end-time">End Time <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-end-time"
                    type="time"
                    className="h-9 text-xs font-mono"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="edit-notes">Reservation Notes</Label>
                <Input
                  id="edit-notes"
                  className="h-9"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this booking request for the asset?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>No</Button>
            <Button onClick={() => handleStatusTransition("Confirmed")}>Approve Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Check Out Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check Out Asset</DialogTitle>
            <DialogDescription>
              Record the physical collection of the asset by the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="checkout-date">Checkout Date</Label>
              <Input
                id="checkout-date"
                type="date"
                className="h-9 text-xs"
                value={transitionDate}
                onChange={(e) => setTransitionDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="checkout-notes">Checkout Remarks</Label>
              <Input
                id="checkout-notes"
                placeholder="Diagnostic remarks, peripheral logs, etc."
                className="h-9"
                value={transitionNotes}
                onChange={(e) => setTransitionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckOutOpen(false)}>Cancel</Button>
            <Button onClick={() => handleStatusTransition("Checked Out")} className="bg-purple-600 hover:bg-purple-700 text-white border-none">
              Collect Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Return Dialog ────────────────────────────────────────────────────── */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Return Booked Asset</DialogTitle>
            <DialogDescription>
              Release the asset back into the shared inventory availability pool.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="return-date">Return Date</Label>
              <Input
                id="return-date"
                type="date"
                className="h-9 text-xs"
                value={transitionDate}
                onChange={(e) => setTransitionDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="return-notes">Inspection / Return Notes</Label>
              <Input
                id="return-notes"
                placeholder="Physical asset condition, cleaning remarks, charger returned, etc."
                className="h-9"
                value={transitionNotes}
                onChange={(e) => setTransitionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnOpen(false)}>Cancel</Button>
            <Button onClick={() => handleStatusTransition("Returned")} className="bg-emerald-600 hover:bg-emerald-700 text-white border-none">
              Return Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Details Dialog ──────────────────────────────────────────────── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" /> Booking Details &amp; Timeline
            </DialogTitle>
            <DialogDescription>Detailed audit details for booking ID: {selectedBooking?.id}</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-5 py-2 text-xs">
              <div className="border rounded-xl p-4 bg-muted/20 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono font-bold text-muted-foreground">{detailedAsset?.tag}</span>
                  <span className="font-bold text-primary">{detailedAsset?.location}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground">{detailedAsset?.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{detailedAsset?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg bg-card">
                <div>
                  <p className="text-muted-foreground font-semibold flex items-center gap-1"><User className="h-3 w-3" /> Reserver</p>
                  <p className="font-bold text-foreground mt-0.5">{detailedEmployee?.name || "Unknown"}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{detailedEmployee?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Created At</p>
                  <p className="font-medium text-foreground mt-0.5">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>

                <div className="col-span-2 border-t pt-2 mt-1">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1"><CalendarRange className="h-3 w-3" /> Reserved Schedule</p>
                  <p className="font-bold text-foreground mt-0.5">
                    {formatDate(selectedBooking.startDate)} ({selectedBooking.startTime}) to {formatDate(selectedBooking.endDate)} ({selectedBooking.endTime})
                  </p>
                </div>

                <div className="col-span-2 border-t pt-2 mt-1">
                  <p className="text-muted-foreground font-semibold flex items-center gap-1"><FileText className="h-3 w-3" /> Purpose</p>
                  <p className="font-medium text-foreground mt-0.5">{selectedBooking.purpose}</p>
                </div>

                {selectedBooking.notes && (
                  <div className="col-span-2 border-t pt-2 mt-1">
                    <p className="text-muted-foreground font-semibold">Special Instructions</p>
                    <p className="font-medium text-foreground italic mt-0.5">&quot;{selectedBooking.notes}&quot;</p>
                  </div>
                )}
              </div>

              {/* Physical check out/in timestamps */}
              {(selectedBooking.checkOutDate || selectedBooking.returnDate) && (
                <div className="space-y-2 border p-3 rounded-lg bg-card border-dashed">
                  <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Physical Check Records</h4>
                  {selectedBooking.checkOutDate && (
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-purple-700">Checked Out At:</span>
                      <span className="font-mono font-medium">{new Date(selectedBooking.checkOutDate).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedBooking.returnDate && (
                    <div className="flex justify-between items-center text-[10px] border-t pt-1">
                      <span className="font-semibold text-emerald-700">Returned At:</span>
                      <span className="font-mono font-medium">{new Date(selectedBooking.returnDate).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Asset reservation history logs */}
              <div className="space-y-3">
                <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider flex items-center gap-1">
                  <History className="h-3.5 w-3.5 text-purple-600" /> Asset Booking Chain Audit Logs
                </h4>
                <div className="border rounded-lg divide-y bg-card overflow-hidden">
                  {assetBookingsChain.length === 0 ? (
                    <div className="p-3 text-center italic text-muted-foreground">No historical timeline.</div>
                  ) : (
                    assetBookingsChain.map((item) => (
                      <div key={item.id} className="p-2.5 flex justify-between items-start hover:bg-muted/10 transition-colors">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold font-mono text-[10px]">{item.id}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">by {getEmployeeName(item.bookedById)}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[200px]" title={item.purpose}>{item.purpose}</p>
                          <p className="text-[9px] text-muted-foreground font-mono mt-0.5">
                            {item.startDate} ({item.startTime}) - {item.endDate} ({item.endTime})
                          </p>
                        </div>
                        <Badge variant="outline" className={`text-[8px] h-4 font-bold border-none uppercase ${
                          item.status === "Pending" ? "bg-amber-100 text-amber-800" :
                          item.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                          item.status === "Checked Out" ? "bg-purple-100 text-purple-800" :
                          item.status === "Returned" ? "bg-emerald-100 text-emerald-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {item.status}
                        </Badge>
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
