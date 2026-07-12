import { mockDepartments, mockCategories, mockEmployees } from "./mock";

// ─── Asset Utilization ────────────────────────────────────────────────────────
export interface AssetUtilizationItem {
  id: string;
  name: string;
  category: string;
  department: string;
  usagePercent: number;
  bookings: number;
  trend: number; // +/- vs last month
}

export const mockAssetUtilization: AssetUtilizationItem[] = [
  { id: "a1",  name: "MacBook Pro 14in",    category: "Electronics",     department: "Engineering",  usagePercent: 94, bookings: 112, trend: +3  },
  { id: "a2",  name: "Dell XPS 15",         category: "Electronics",     department: "Engineering",  usagePercent: 91, bookings: 108, trend: -1  },
  { id: "a3",  name: "Conference Room AV",  category: "IT Equipment",    department: "Facilities",   usagePercent: 88, bookings: 96,  trend: +5  },
  { id: "a4",  name: "Ford Transit Van",    category: "Vehicles",        department: "Field Ops",    usagePercent: 85, bookings: 60,  trend: +2  },
  { id: "a5",  name: "Projector Epson X",   category: "IT Equipment",    department: "Facilities",   usagePercent: 82, bookings: 88,  trend: -4  },
  { id: "a6",  name: "HP LaserJet Pro",     category: "IT Equipment",    department: "Engineering",  usagePercent: 61, bookings: 45,  trend: 0   },
  { id: "a7",  name: "Standing Desk A3",    category: "Furniture",       department: "Engineering",  usagePercent: 55, bookings: 40,  trend: +1  },
  { id: "a8",  name: "iPad Pro 12.9in",     category: "Electronics",     department: "Field Ops",    usagePercent: 48, bookings: 32,  trend: -6  },
  { id: "a9",  name: "Ergonomic Chair B2",  category: "Furniture",       department: "Facilities",   usagePercent: 30, bookings: 18,  trend: -2  },
  { id: "a10", name: "Label Printer",       category: "Office Supplies", department: "Field Ops",    usagePercent: 18, bookings: 11,  trend: -3  },
  { id: "a11", name: "Backup Drive 4TB",    category: "IT Equipment",    department: "Engineering",  usagePercent: 14, bookings: 8,   trend: 0   },
  { id: "a12", name: "Paper Shredder",      category: "Office Supplies", department: "Facilities",   usagePercent: 9,  bookings: 5,   trend: -1  },
];

// ─── Department Allocation ─────────────────────────────────────────────────────
export interface DepartmentAllocationItem {
  department: string;
  total: number;
  active: number;
  available: number;
  underMaintenance: number;
}

export const mockDepartmentAllocation: DepartmentAllocationItem[] = [
  { department: "Engineering",      total: 52, active: 44, available: 6, underMaintenance: 2 },
  { department: "Facilities",       total: 38, active: 30, available: 5, underMaintenance: 3 },
  { department: "Field Ops",        total: 29, active: 22, available: 5, underMaintenance: 2 },
  { department: "Field Ops (East)", total: 17, active: 11, available: 4, underMaintenance: 2 },
];

// ─── Maintenance Analytics ─────────────────────────────────────────────────────
export interface MaintenanceMonthData {
  month: string;
  completed: number;
  pending: number;
  cost: number;
}

export const mockMaintenanceTrend: MaintenanceMonthData[] = [
  { month: "Feb", completed: 14, pending: 4,  cost: 8200  },
  { month: "Mar", completed: 18, pending: 6,  cost: 12400 },
  { month: "Apr", completed: 11, pending: 8,  cost: 6800  },
  { month: "May", completed: 22, pending: 5,  cost: 15600 },
  { month: "Jun", completed: 16, pending: 9,  cost: 11200 },
  { month: "Jul", completed: 9,  pending: 12, cost: 7400  },
];

export interface PendingMaintenanceItem {
  id: string;
  asset: string;
  category: string;
  department: string;
  issue: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  dueDate: string;
}

export const mockPendingMaintenance: PendingMaintenanceItem[] = [
  { id: "m1", asset: "Ford Transit Van",   category: "Vehicles",        department: "Field Ops",   issue: "Engine oil change",     priority: "Critical", dueDate: "2026-07-14" },
  { id: "m2", asset: "Conference Room AV", category: "IT Equipment",    department: "Facilities",  issue: "HDMI port failure",     priority: "High",     dueDate: "2026-07-16" },
  { id: "m3", asset: "Dell XPS 15",        category: "Electronics",     department: "Engineering", issue: "Battery replacement",   priority: "High",     dueDate: "2026-07-18" },
  { id: "m4", asset: "Ergonomic Chair B2", category: "Furniture",       department: "Facilities",  issue: "Armrest broken",        priority: "Medium",   dueDate: "2026-07-22" },
  { id: "m5", asset: "HP LaserJet Pro",    category: "IT Equipment",    department: "Engineering", issue: "Paper jam mechanism",   priority: "Medium",   dueDate: "2026-07-25" },
  { id: "m6", asset: "Label Printer",      category: "Office Supplies", department: "Field Ops",   issue: "Ink cartridge replace", priority: "Low",      dueDate: "2026-07-30" },
];

// ─── Retirement Forecast ───────────────────────────────────────────────────────
export interface RetirementForecastItem {
  id: string;
  name: string;
  category: string;
  department: string;
  purchaseYear: number;
  retirementYear: number;
  ageYears: number;
  daysUntilRetirement: number;
}

export const mockRetirementForecast: RetirementForecastItem[] = [
  { id: "r1", name: "Dell XPS 15",        category: "Electronics",  department: "Engineering", purchaseYear: 2020, retirementYear: 2026, ageYears: 6, daysUntilRetirement: 42  },
  { id: "r2", name: "Ford Transit Van",   category: "Vehicles",     department: "Field Ops",   purchaseYear: 2019, retirementYear: 2026, ageYears: 7, daysUntilRetirement: 68  },
  { id: "r3", name: "Projector Epson X",  category: "IT Equipment", department: "Facilities",  purchaseYear: 2020, retirementYear: 2026, ageYears: 6, daysUntilRetirement: 104 },
  { id: "r4", name: "HP LaserJet Pro",    category: "IT Equipment", department: "Engineering", purchaseYear: 2020, retirementYear: 2026, ageYears: 6, daysUntilRetirement: 156 },
  { id: "r5", name: "iPad Pro 12.9in",    category: "Electronics",  department: "Field Ops",   purchaseYear: 2021, retirementYear: 2026, ageYears: 5, daysUntilRetirement: 218 },
  { id: "r6", name: "Backup Drive 4TB",   category: "IT Equipment", department: "Engineering", purchaseYear: 2021, retirementYear: 2027, ageYears: 5, daysUntilRetirement: 320 },
  { id: "r7", name: "Conference Room AV", category: "IT Equipment", department: "Facilities",  purchaseYear: 2018, retirementYear: 2027, ageYears: 8, daysUntilRetirement: 412 },
];

export interface AssetAgeByCategory {
  category: string;
  avgAge: number;
  count: number;
}

export const mockAssetAgeByCategory: AssetAgeByCategory[] = [
  { category: "Electronics",     avgAge: 4.2, count: 48 },
  { category: "IT Equipment",    avgAge: 5.1, count: 61 },
  { category: "Vehicles",        avgAge: 6.3, count: 12 },
  { category: "Furniture",       avgAge: 7.8, count: 55 },
  { category: "Office Supplies", avgAge: 2.1, count: 72 },
];

// ─── Booking Analytics ─────────────────────────────────────────────────────────
export interface BookingHeatmapCell {
  day: string;
  hour: string;
  count: number;
}

const BOOKING_DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const BOOKING_HOURS = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"];

const heatmapMatrix: number[][] = [
  [2, 6, 12, 14, 10, 8,  14, 12, 9,  4, 1], // Mon
  [3, 8, 16, 18, 12, 9,  18, 15, 11, 5, 2], // Tue
  [4, 10, 18, 20, 14, 11, 20, 17, 13, 6, 2], // Wed
  [3, 8, 15, 17, 11, 9,  16, 14, 10, 5, 1], // Thu
  [2, 6, 10, 12, 9,  7,  10, 8,  6,  3, 1], // Fri
];

export const mockBookingHeatmap: BookingHeatmapCell[] = BOOKING_DAYS.flatMap((day, di) =>
  BOOKING_HOURS.map((hour, hi) => ({ day, hour, count: heatmapMatrix[di][hi] }))
);

export interface MostBookedResource {
  resource: string;
  category: string;
  bookings: number;
  trend: number;
}

export const mockMostBookedResources: MostBookedResource[] = [
  { resource: "MacBook Pro 14in",    category: "Electronics",  bookings: 112, trend: +3 },
  { resource: "Dell XPS 15",         category: "Electronics",  bookings: 108, trend: -1 },
  { resource: "Conference Room AV",  category: "IT Equipment", bookings: 96,  trend: +5 },
  { resource: "Projector Epson X",   category: "IT Equipment", bookings: 88,  trend: -4 },
  { resource: "Ford Transit Van",    category: "Vehicles",     bookings: 60,  trend: +2 },
  { resource: "Standing Desk A3",    category: "Furniture",    bookings: 40,  trend: +1 },
  { resource: "HP LaserJet Pro",     category: "IT Equipment", bookings: 45,  trend: 0  },
  { resource: "iPad Pro 12.9in",     category: "Electronics",  bookings: 32,  trend: -6 },
];

export interface BookingTrendData {
  month: string;
  bookings: number;
  peakHour: string;
}

export const mockBookingTrend: BookingTrendData[] = [
  { month: "Feb", bookings: 210, peakHour: "10am" },
  { month: "Mar", bookings: 268, peakHour: "11am" },
  { month: "Apr", bookings: 245, peakHour: "10am" },
  { month: "May", bookings: 310, peakHour: "2pm"  },
  { month: "Jun", bookings: 290, peakHour: "11am" },
  { month: "Jul", bookings: 182, peakHour: "10am" },
];

// ─── Re-export org setup data for cross-use ───────────────────────────────────
export { mockDepartments, mockCategories, mockEmployees };
