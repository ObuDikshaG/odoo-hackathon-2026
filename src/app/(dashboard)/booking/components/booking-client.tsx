"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingKpi } from "./booking-kpi";
import { BookingFilters, BookingFiltersState } from "./booking-filters";
import { BookingTable } from "./booking-table";
import { BookingCalendar } from "./booking-calendar";
import { BookingDialogs } from "./booking-dialogs";
import { getStoredBookings, saveBookings, generateNextBookingId, Booking, BookingStatus } from "@/lib/data/bookingStore";
import { getStoredAssets, Asset } from "@/lib/data/assetStore";
import { mockEmployees } from "@/lib/data/mock";
import { CalendarRange, PlusCircle, History, LayoutGrid } from "lucide-react";

export function BookingClient() {
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredBookings());
  const [assets] = useState<Asset[]>(() => getStoredAssets());

  const [filters, setFilters] = useState<BookingFiltersState>({
    searchQuery: "",
    status: "all",
    assetId: "all",
    dateFilter: "",
  });

  // Modal open states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  // Focus elements
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleSaveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    saveBookings(newBookings);
  };

  // --- Handlers ---

  const handleCreateBooking = (data: {
    assetId: string;
    bookedById: string;
    purpose: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    notes?: string;
  }) => {
    const newBooking: Booking = {
      id: generateNextBookingId(bookings),
      assetId: data.assetId,
      bookedById: data.bookedById,
      purpose: data.purpose,
      startDate: data.startDate,
      startTime: data.startTime,
      endDate: data.endDate,
      endTime: data.endTime,
      status: "Pending",
      checkOutDate: null,
      returnDate: null,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    handleSaveBookings([...bookings, newBooking]);
    setIsCreateOpen(false);
  };

  const handleEditBooking = (id: string, data: {
    purpose: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    notes?: string;
  }) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          purpose: data.purpose,
          startDate: data.startDate,
          startTime: data.startTime,
          endDate: data.endDate,
          endTime: data.endTime,
          notes: data.notes,
        };
      }
      return b;
    });

    handleSaveBookings(updated);
    setIsEditOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusSubmit = (id: string, newStatus: BookingStatus, data?: { date: string; notes?: string }) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        let checkOutDate = b.checkOutDate;
        let returnDate = b.returnDate;
        let notes = b.notes || "";

        if (newStatus === "Checked Out" && data) {
          const nowTime = new Date().toTimeString().split(" ")[0];
          checkOutDate = `${data.date}T${nowTime}Z`;
          if (data.notes) {
            notes = notes ? `${notes}\nCheckout: ${data.notes}` : `Checkout: ${data.notes}`;
          }
        }

        if (newStatus === "Returned" && data) {
          const nowTime = new Date().toTimeString().split(" ")[0];
          returnDate = `${data.date}T${nowTime}Z`;
          if (data.notes) {
            notes = notes ? `${notes}\nReturn: ${data.notes}` : `Return: ${data.notes}`;
          }
        }

        return {
          ...b,
          status: newStatus,
          checkOutDate,
          returnDate,
          notes,
        };
      }
      return b;
    });

    handleSaveBookings(updated);

    // Close corresponding modal
    setIsConfirmOpen(false);
    setIsCheckOutOpen(false);
    setIsReturnOpen(false);
    setSelectedBooking(null);
  };

  const handleTableTransitionStatus = (booking: Booking, newStatus: BookingStatus) => {
    setSelectedBooking(booking);
    if (newStatus === "Confirmed") {
      setIsConfirmOpen(true);
    } else if (newStatus === "Checked Out") {
      setIsCheckOutOpen(true);
    } else if (newStatus === "Returned") {
      setIsReturnOpen(true);
    } else if (newStatus === "Cancelled") {
      // Direct transition with simple confirm, or handle directly here
      if (confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
        handleStatusSubmit(booking.id, "Cancelled");
      }
    }
  };

  // Pre-fill parameters when quick-booking from calendar cell click
  const handleQuickBook = (assetId: string, dateStr: string) => {
    // Open create dialog and set default values via setTimeout or direct state values
    setIsCreateOpen(true);
    // Directly prefill the fields in CreateBooking state
    // We achieve this in CreateBooking component through state initializing
    // But since states are inside create dialog, we can pass down default prefills or trigger dialog state change.
    // To make it simple, let's keep track of a prefill state:
    setCalendarPrefill({ assetId, dateStr });
  };

  const [calendarPrefill, setCalendarPrefill] = useState<{ assetId: string; dateStr: string } | null>(null);

  // --- Filtering Logic ---

  const getFilteredBookings = (tabFilter: "active" | "history") => {
    return bookings.filter((b) => {
      // Tab filter
      const isHistory = b.status === "Returned" || b.status === "Cancelled";
      if (tabFilter === "active" && isHistory) return false;
      if (tabFilter === "history" && !isHistory) return false;

      const asset = assets.find((a) => a.id === b.assetId);
      const assetName = asset?.name.toLowerCase() || "";
      const assetTag = asset?.tag.toLowerCase() || "";
      const employee = mockEmployees.find((e) => e.id === b.bookedById);
      const employeeName = employee?.name.toLowerCase() || "";
      const purposeLower = b.purpose.toLowerCase();
      const idLower = b.id.toLowerCase();
      const searchLower = filters.searchQuery.toLowerCase();

      // Search matches
      const matchesSearch =
        idLower.includes(searchLower) ||
        assetName.includes(searchLower) ||
        assetTag.includes(searchLower) ||
        employeeName.includes(searchLower) ||
        purposeLower.includes(searchLower);

      const matchesStatus = filters.status === "all" || b.status === filters.status;
      const matchesAsset = filters.assetId === "all" || b.assetId === filters.assetId;

      // Check if dateFilter lies within startDate and endDate
      let matchesDate = true;
      if (filters.dateFilter) {
        matchesDate = filters.dateFilter >= b.startDate && filters.dateFilter <= b.endDate;
      }

      return matchesSearch && matchesStatus && matchesAsset && matchesDate;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Booking Management</h1>
          <p className="text-muted-foreground">
            Reserve assets for field tasks, presentations, and events while avoiding conflicts.
          </p>
        </div>
        <Button onClick={() => { setCalendarPrefill(null); setIsCreateOpen(true); }} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Book Asset
        </Button>
      </div>

      {/* KPIs */}
      <BookingKpi bookings={bookings} />

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="active" className="flex items-center gap-1.5"><CalendarRange className="h-4 w-4" /> Active Bookings</TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1.5"><LayoutGrid className="h-4 w-4" /> Week Schedule</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1.5"><History className="h-4 w-4" /> History Log</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          <BookingFilters filters={filters} onChange={setFilters} assets={assets} />
          <BookingTable
            bookings={getFilteredBookings("active")}
            assets={assets}
            onViewDetails={(b) => { setSelectedBooking(b); setIsDetailsOpen(true); }}
            onEdit={(b) => { setSelectedBooking(b); setIsEditOpen(true); }}
            onTransitionStatus={handleTableTransitionStatus}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <BookingCalendar
            bookings={bookings}
            assets={assets}
            onViewDetails={(b) => { setSelectedBooking(b); setIsDetailsOpen(true); }}
            onQuickBook={handleQuickBook}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <BookingFilters filters={filters} onChange={setFilters} assets={assets} />
          <BookingTable
            bookings={getFilteredBookings("history")}
            assets={assets}
            onViewDetails={(b) => { setSelectedBooking(b); setIsDetailsOpen(true); }}
            onEdit={(b) => { setSelectedBooking(b); setIsEditOpen(true); }}
            onTransitionStatus={handleTableTransitionStatus}
          />
        </TabsContent>
      </Tabs>

      {/* Modals & Dialogs Orchestrator */}
      <BookingDialogs
        assets={assets}
        bookings={bookings}
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        onCreateSubmit={handleCreateBooking}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        selectedBooking={selectedBooking}
        onEditSubmit={handleEditBooking}
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        isConfirmOpen={isConfirmOpen}
        setIsConfirmOpen={setIsConfirmOpen}
        isCheckOutOpen={isCheckOutOpen}
        setIsCheckOutOpen={setIsCheckOutOpen}
        isReturnOpen={isReturnOpen}
        setIsReturnOpen={setIsReturnOpen}
        onStatusSubmit={handleStatusSubmit}
        prefill={calendarPrefill}
      />
    </div>
  );
}
