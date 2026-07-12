export type BookingStatus = "Pending" | "Confirmed" | "Checked Out" | "Returned" | "Cancelled";

export interface Booking {
  id: string;
  assetId: string;
  bookedById: string;
  purpose: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: BookingStatus;
  checkOutDate: string | null;
  returnDate: string | null;
  notes?: string;
  createdAt: string;
}

export const initialBookings: Booking[] = [
  {
    id: "BK-0001",
    assetId: "a1", // MacBook Pro 16"
    bookedById: "e5", // Priya Shah
    purpose: "Sprint demo presentation & client meeting",
    startDate: "2026-07-15",
    startTime: "09:00",
    endDate: "2026-07-15",
    endTime: "12:00",
    status: "Confirmed",
    checkOutDate: null,
    returnDate: null,
    notes: "Requires HDMI adapter and charger.",
    createdAt: "2026-07-12T10:00:00Z"
  },
  {
    id: "BK-0002",
    assetId: "a3", // Delivery Van
    bookedById: "e2", // Rohan Mehta
    purpose: "Warehouse A to B inventory transfer supply run",
    startDate: "2026-07-12",
    startTime: "08:00",
    endDate: "2026-07-12",
    endTime: "16:00",
    status: "Checked Out",
    checkOutDate: "2026-07-12T08:05:00Z",
    returnDate: null,
    notes: "Van keys and logbook collected from desk.",
    createdAt: "2026-07-11T16:00:00Z"
  },
  {
    id: "BK-0003",
    assetId: "a4", // Dell 27" Monitor
    bookedById: "e1", // Aditi Rao
    purpose: "UI/UX design review session with product team",
    startDate: "2026-07-10",
    startTime: "13:00",
    endDate: "2026-07-10",
    endTime: "15:00",
    status: "Returned",
    checkOutDate: "2026-07-10T12:55:00Z",
    returnDate: "2026-07-10T15:10:00Z",
    notes: "Cleaned panel and power cable after returning.",
    createdAt: "2026-07-09T09:30:00Z"
  },
  {
    id: "BK-0004",
    assetId: "a1", // MacBook Pro 16"
    bookedById: "e3", // Sana Iqbal
    purpose: "IT onboarding and workshop",
    startDate: "2026-07-20",
    startTime: "10:00",
    endDate: "2026-07-20",
    endTime: "14:00",
    status: "Pending",
    checkOutDate: null,
    returnDate: null,
    notes: "Requesting software setups pre-installed.",
    createdAt: "2026-07-12T11:00:00Z"
  }
];

export function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") return initialBookings;
  try {
    const stored = localStorage.getItem("assetflow_bookings");
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem("assetflow_bookings", JSON.stringify(initialBookings));
      return initialBookings;
    }
  } catch (error) {
    console.error("Error reading bookings from localStorage:", error);
    return initialBookings;
  }
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("assetflow_bookings", JSON.stringify(bookings));
  } catch (error) {
    console.error("Error saving bookings to localStorage:", error);
  }
}

export function generateNextBookingId(bookings: Booking[]): string {
  let maxNum = 0;
  bookings.forEach((b) => {
    const match = b.id.match(/^BK-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  });
  const nextNum = maxNum + 1;
  return `BK-${String(nextNum).padStart(4, "0")}`;
}

export function hasBookingConflict(
  bookings: Booking[],
  assetId: string,
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
  excludeId?: string
): boolean {
  try {
    const newStart = new Date(`${startDate}T${startTime}`).getTime();
    const newEnd = new Date(`${endDate}T${endTime}`).getTime();

    if (isNaN(newStart) || isNaN(newEnd)) {
      return false;
    }

    return bookings.some((b) => {
      if (b.id === excludeId) return false;
      if (b.assetId !== assetId) return false;
      if (b.status === "Cancelled" || b.status === "Returned") return false;

      const existStart = new Date(`${b.startDate}T${b.startTime}`).getTime();
      const existEnd = new Date(`${b.endDate}T${b.endTime}`).getTime();

      if (isNaN(existStart) || isNaN(existEnd)) {
        return false;
      }

      return newStart < existEnd && newEnd > existStart;
    });
  } catch (err) {
    console.error("Error checking conflict:", err);
    return false;
  }
}
