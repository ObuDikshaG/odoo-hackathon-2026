"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, ArrowUpRight, ArrowDownLeft, Edit, XCircle, CalendarRange } from "lucide-react";
import { Booking } from "@/lib/data/bookingStore";
import { Asset } from "@/lib/data/assetStore";
import { mockEmployees } from "@/lib/data/mock";

interface BookingTableProps {
  bookings: Booking[];
  assets: Asset[];
  onViewDetails: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onTransitionStatus: (booking: Booking, newStatus: Booking["status"]) => void;
}

export function BookingTable({
  bookings,
  assets,
  onViewDetails,
  onEdit,
  onTransitionStatus,
}: BookingTableProps) {
  const getAssetDetails = (assetId: string) => {
    return assets.find((a) => a.id === assetId);
  };

  const getEmployeeName = (empId: string) => {
    return mockEmployees.find((e) => e.id === empId)?.name || "Unknown Employee";
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50/50">Pending</Badge>;
      case "Confirmed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-none hover:bg-blue-100">Confirmed</Badge>;
      case "Checked Out":
        return <Badge variant="default" className="bg-purple-500 hover:bg-purple-600 text-white border-none">Checked Out</Badge>;
      case "Returned":
        return <Badge variant="secondary" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">Returned</Badge>;
      case "Cancelled":
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-none hover:bg-red-50">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDateTimeRange = (b: Booking) => {
    const start = new Date(`${b.startDate}T${b.startTime}`);
    const end = new Date(`${b.endDate}T${b.endTime}`);

    const startDateStr = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const startTimeStr = b.startTime;
    const endDateStr = end.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const endTimeStr = b.endTime;

    if (b.startDate === b.endDate) {
      return (
        <div className="flex flex-col text-xs font-mono">
          <span className="font-semibold text-foreground">{startDateStr}</span>
          <span className="text-muted-foreground">{startTimeStr} - {endTimeStr}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col text-xs font-mono">
        <span className="font-semibold text-foreground">{startDateStr} ({startTimeStr})</span>
        <span className="text-muted-foreground">to {endDateStr} ({endTimeStr})</span>
      </div>
    );
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold w-[100px]">Booking ID</TableHead>
              <TableHead className="font-semibold">Asset Tag &amp; Name</TableHead>
              <TableHead className="font-semibold">Booked By</TableHead>
              <TableHead className="font-semibold">Purpose</TableHead>
              <TableHead className="font-semibold">Schedule</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <CalendarRange className="h-8 w-8 text-muted-foreground/60 mb-1" />
                    <p className="font-medium">No bookings found</p>
                    <p className="text-xs">Adjust your filters or make a new reservation.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => {
                const asset = getAssetDetails(b.assetId);
                return (
                  <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold text-xs">{b.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-xs text-muted-foreground">{asset?.tag || "-"}</span>
                        <span className="font-medium text-sm">{asset?.name || "Unknown Asset"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {getEmployeeName(b.bookedById)}
                    </TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate" title={b.purpose}>
                      {b.purpose}
                    </TableCell>
                    <TableCell>{formatDateTimeRange(b)}</TableCell>
                    <TableCell>{getStatusBadge(b.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => onViewDetails(b)} className="flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </DropdownMenuItem>

                          {b.status === "Pending" && (
                            <DropdownMenuItem onClick={() => onTransitionStatus(b, "Confirmed")} className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-blue-600" /> Confirm
                            </DropdownMenuItem>
                          )}

                          {b.status === "Confirmed" && (
                            <DropdownMenuItem onClick={() => onTransitionStatus(b, "Checked Out")} className="flex items-center gap-2">
                              <ArrowUpRight className="h-3.5 w-3.5 text-purple-600" /> Check Out
                            </DropdownMenuItem>
                          )}

                          {b.status === "Checked Out" && (
                            <DropdownMenuItem onClick={() => onTransitionStatus(b, "Returned")} className="flex items-center gap-2">
                              <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600" /> Return Asset
                            </DropdownMenuItem>
                          )}

                          {(b.status === "Pending" || b.status === "Confirmed") && (
                            <>
                              <DropdownMenuItem onClick={() => onEdit(b)} className="flex items-center gap-2">
                                <Edit className="h-3.5 w-3.5" /> Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onTransitionStatus(b, "Cancelled")} className="flex items-center gap-2 text-destructive focus:text-destructive">
                                <XCircle className="h-3.5 w-3.5" /> Cancel Reservation
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
