"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/lib/data/bookingStore";
import { CalendarDays, Clock, PackageCheck, CalendarClock } from "lucide-react";

interface BookingKpiProps {
  bookings: Booking[];
}

export function BookingKpi({ bookings }: BookingKpiProps) {
  const total = bookings.length;

  const activeReservations = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Confirmed" || b.status === "Checked Out"
  ).length;

  const checkedOutNow = bookings.filter((b) => b.status === "Checked Out").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const todaysBookings = bookings.filter((b) => {
    if (b.status === "Cancelled" || b.status === "Returned") return false;
    return todayStr >= b.startDate && todayStr <= b.endDate;
  }).length;

  const cards = [
    {
      title: "Total Bookings",
      value: total,
      icon: CalendarDays,
      description: "All time booking requests",
      colorClass: "text-blue-600"
    },
    {
      title: "Active Reservations",
      value: activeReservations,
      icon: CalendarClock,
      description: "Pending, Confirmed or Checked Out",
      colorClass: "text-purple-600"
    },
    {
      title: "Checked Out Now",
      value: checkedOutNow,
      icon: Clock,
      description: "Assets physically in use",
      colorClass: "text-amber-600"
    },
    {
      title: "Today's Bookings",
      value: todaysBookings,
      icon: PackageCheck,
      description: "Currently active schedules today",
      colorClass: "text-emerald-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.colorClass}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
