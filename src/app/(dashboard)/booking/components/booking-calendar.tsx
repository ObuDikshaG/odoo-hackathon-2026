"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Booking } from "@/lib/data/bookingStore";
import { Asset } from "@/lib/data/assetStore";
import { Badge } from "@/components/ui/badge";

interface BookingCalendarProps {
  bookings: Booking[];
  assets: Asset[];
  onViewDetails: (booking: Booking) => void;
  onQuickBook: (assetId: string, dateStr: string) => void;
}

export function BookingCalendar({
  bookings,
  assets,
  onViewDetails,
  onQuickBook,
}: BookingCalendarProps) {
  // Local state for week tracking
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Helper: Get Monday of the week containing the currentDate
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getMonday(currentDate);

  // Generate 7 days for the header
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + idx);
    return day;
  });

  const formatDateStr = (d: Date) => {
    return d.toISOString().split("T")[0];
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "prev" ? -7 : 7));
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Find booking on a given date for an asset
  const getBookingForAssetOnDate = (assetId: string, dateStr: string) => {
    // Return the first active booking that overlaps with this date
    return bookings.find((b) => {
      if (b.status === "Cancelled") return false;
      if (b.assetId !== assetId) return false;
      return dateStr >= b.startDate && dateStr <= b.endDate;
    });
  };

  const getCalendarBlockStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/80";
      case "Confirmed":
        return "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100/80";
      case "Checked Out":
        return "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100/80";
      case "Returned":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/80";
      default:
        return "bg-slate-50 text-slate-800 border-slate-300";
    }
  };

  const formatWeekRangeString = () => {
    const startStr = startOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endStr = endOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return `${startStr} - ${endStr}`;
  };

  const bookableAssets = assets.filter((a) => a.status !== "Retired" && a.status !== "Disposed");

  return (
    <div className="space-y-4 bg-card p-4 rounded-xl border shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Asset Availability Schedule
          </h2>
          <p className="text-xs text-muted-foreground">
            Visual calendar mapping reservation timeslots for active devices and facilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigateToday} className="h-8 text-xs">
            Today
          </Button>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button variant="ghost" size="icon" onClick={() => navigateWeek("prev")} className="h-8 w-8 rounded-none border-r">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold font-mono px-3 py-1.5 bg-muted/30">
              {formatWeekRangeString()}
            </span>
            <Button variant="ghost" size="icon" onClick={() => navigateWeek("next")} className="h-8 w-8 rounded-none border-l">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold w-[220px]">Asset Name</TableHead>
              {days.map((day, idx) => (
                <TableHead key={idx} className="font-mono text-xs text-center font-bold min-w-[120px]">
                  <div>{day.toLocaleDateString(undefined, { weekday: "short" })}</div>
                  <div className="text-[10px] text-muted-foreground font-normal">
                    {day.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookableAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No bookable assets available in directory.
                </TableCell>
              </TableRow>
            ) : (
              bookableAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-muted/10">
                  <TableCell className="font-medium align-middle">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{asset.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{asset.tag}</span>
                    </div>
                  </TableCell>
                  {days.map((day, idx) => {
                    const dateStr = formatDateStr(day);
                    const booking = getBookingForAssetOnDate(asset.id, dateStr);

                    if (booking) {
                      return (
                        <TableCell key={idx} className="p-1.5 align-middle text-center">
                          <div
                            onClick={() => onViewDetails(booking)}
                            className={`border text-[11px] font-semibold py-2 px-2 rounded-lg cursor-pointer transition-all shadow-xs flex flex-col justify-center items-center h-[52px] ${getCalendarBlockStyle(
                              booking.status
                            )}`}
                          >
                            <span className="truncate max-w-full font-medium">{booking.purpose}</span>
                            <Badge variant="outline" className="text-[8px] h-3 px-1 mt-1 font-mono uppercase bg-background/50 border-none font-bold">
                              {booking.status}
                            </Badge>
                          </div>
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={idx} className="p-1 text-center align-middle h-[60px]">
                        <Button
                          variant="ghost"
                          onClick={() => onQuickBook(asset.id, dateStr)}
                          className="w-full h-full text-muted-foreground hover:text-primary group flex items-center justify-center rounded-lg border-2 border-dashed border-transparent hover:border-muted hover:bg-muted/20"
                          title="Click to reserve this slot"
                        >
                          <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center text-xs text-muted-foreground pt-2">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-400" /> Pending Approval</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-blue-500" /> Confirmed</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-purple-500" /> Checked Out</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Returned</span>
      </div>
    </div>
  );
}
