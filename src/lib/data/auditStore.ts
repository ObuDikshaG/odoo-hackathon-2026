export interface AuditEntry {
  id: string;
  timestamp: string;
  module: "Asset" | "Allocation" | "Maintenance" | "Booking" | "Organization";
  action: string;
  assetId: string | null;
  assetName: string | null;
  assetTag: string | null;
  performedById: string;
  performedByName: string;
  description: string;
  details?: string;
}

export const initialAuditEntries: AuditEntry[] = [
  {
    id: "AUD-0001",
    timestamp: "2026-01-10T10:00:00Z",
    module: "Asset",
    action: "Register",
    assetId: "a1",
    assetName: "MacBook Pro 16\"",
    assetTag: "AF-0001",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Asset AF-0001 (MacBook Pro 16\") registered in inventory.",
    details: JSON.stringify({ categoryId: "c1", location: "HQ - 4th Floor", status: "Available" })
  },
  {
    id: "AUD-0002",
    timestamp: "2026-02-14T10:00:00Z",
    module: "Maintenance",
    action: "Create Request",
    assetId: "a2",
    assetName: "Ergonomic Desk Chair",
    assetTag: "AF-0002",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Maintenance request mr-2 (Caster Wheel Replacement) created for Ergonomic Desk Chair.",
    details: JSON.stringify({ priority: "Low", type: "Corrective" })
  },
  {
    id: "AUD-0003",
    timestamp: "2026-02-15T11:30:00Z",
    module: "Asset",
    action: "Status Change",
    assetId: "a2",
    assetName: "Ergonomic Desk Chair",
    assetTag: "AF-0002",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Asset AF-0002 (Ergonomic Desk Chair) status updated to Allocated.",
    details: JSON.stringify({ oldStatus: "Available", newStatus: "Allocated" })
  },
  {
    id: "AUD-0004",
    timestamp: "2026-02-15T11:30:00Z",
    module: "Allocation",
    action: "Allocate",
    assetId: "a2",
    assetName: "Ergonomic Desk Chair",
    assetTag: "AF-0002",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Asset AF-0002 allocated to employee Priya Shah (Facilities).",
    details: JSON.stringify({ allocationId: "al-1", notes: "Allocated standard office chair to Priya Shah at Facilities department." })
  },
  {
    id: "AUD-0005",
    timestamp: "2026-02-15T16:00:00Z",
    module: "Maintenance",
    action: "Complete",
    assetId: "a2",
    assetName: "Ergonomic Desk Chair",
    assetTag: "AF-0002",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Maintenance request mr-2 (Caster Wheel Replacement) completed. Cost: $45.",
    details: JSON.stringify({ cost: 45, completionDate: "2026-02-15", notes: "Installed standard heavy-duty carpet casters." })
  },
  {
    id: "AUD-0006",
    timestamp: "2026-03-01T09:00:00Z",
    module: "Asset",
    action: "Register",
    assetId: "a3",
    assetName: "Delivery Van",
    assetTag: "AF-0003",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Asset AF-0003 (Delivery Van) registered in inventory.",
    details: JSON.stringify({ categoryId: "c3", location: "Warehouse A", status: "Under Maintenance" })
  },
  {
    id: "AUD-0007",
    timestamp: "2026-03-10T14:20:00Z",
    module: "Asset",
    action: "Register",
    assetId: "a4",
    assetName: "Dell 27\" UltraSharp Monitor",
    assetTag: "AF-0004",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Asset AF-0004 (Dell 27\" UltraSharp Monitor) registered in inventory.",
    details: JSON.stringify({ categoryId: "c4", location: "HQ - 4th Floor", status: "Available" })
  },
  {
    id: "AUD-0008",
    timestamp: "2026-04-05T16:45:00Z",
    module: "Asset",
    action: "Retire",
    assetId: "a5",
    assetName: "Heavy Duty Office Desk",
    assetTag: "AF-0005",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Asset AF-0005 (Heavy Duty Office Desk) retired from inventory.",
    details: JSON.stringify({ status: "Retired" })
  },
  {
    id: "AUD-0009",
    timestamp: "2026-06-01T14:00:00Z",
    module: "Maintenance",
    action: "Create Request",
    assetId: "a4",
    assetName: "Dell 27\" UltraSharp Monitor",
    assetTag: "AF-0004",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Maintenance request mr-3 (Color Calibration & Clean) created for Dell 27\" UltraSharp Monitor.",
    details: JSON.stringify({ priority: "Medium", type: "Preventive" })
  },
  {
    id: "AUD-0010",
    timestamp: "2026-07-01T09:00:00Z",
    module: "Maintenance",
    action: "Create Request",
    assetId: "a3",
    assetName: "Delivery Van",
    assetTag: "AF-0003",
    performedById: "admin",
    performedByName: "System Admin",
    description: "Maintenance request mr-1 (Engine Diagnostics & Oil Change) created for Delivery Van.",
    details: JSON.stringify({ priority: "High", type: "Corrective" })
  },
  {
    id: "AUD-0011",
    timestamp: "2026-07-09T09:30:00Z",
    module: "Booking",
    action: "Create Booking",
    assetId: "a4",
    assetName: "Dell 27\" UltraSharp Monitor",
    assetTag: "AF-0004",
    performedById: "e1",
    performedByName: "Aditi Rao",
    description: "Booking BK-0003 created for Dell 27\" UltraSharp Monitor by Aditi Rao.",
    details: JSON.stringify({ startDate: "2026-07-10", endDate: "2026-07-10" })
  },
  {
    id: "AUD-0012",
    timestamp: "2026-07-10T12:55:00Z",
    module: "Booking",
    action: "Check Out",
    assetId: "a4",
    assetName: "Dell 27\" UltraSharp Monitor",
    assetTag: "AF-0004",
    performedById: "e1",
    performedByName: "Aditi Rao",
    description: "Booking BK-0003 checked out for Dell 27\" UltraSharp Monitor.",
    details: JSON.stringify({ checkOutDate: "2026-07-10T12:55:00Z" })
  },
  {
    id: "AUD-0013",
    timestamp: "2026-07-10T15:10:00Z",
    module: "Booking",
    action: "Return",
    assetId: "a4",
    assetName: "Dell 27\" UltraSharp Monitor",
    assetTag: "AF-0004",
    performedById: "e1",
    performedByName: "Aditi Rao",
    description: "Booking BK-0003 returned for Dell 27\" UltraSharp Monitor.",
    details: JSON.stringify({ returnDate: "2026-07-10T15:10:00Z", notes: "Cleaned panel and power cable after returning." })
  },
  {
    id: "AUD-0014",
    timestamp: "2026-07-11T16:00:00Z",
    module: "Booking",
    action: "Create Booking",
    assetId: "a3",
    assetName: "Delivery Van",
    assetTag: "AF-0003",
    performedById: "e2",
    performedByName: "Rohan Mehta",
    description: "Booking BK-0002 created for Delivery Van by Rohan Mehta.",
    details: JSON.stringify({ startDate: "2026-07-12", endDate: "2026-07-12" })
  },
  {
    id: "AUD-0015",
    timestamp: "2026-07-12T08:05:00Z",
    module: "Booking",
    action: "Check Out",
    assetId: "a3",
    assetName: "Delivery Van",
    assetTag: "AF-0003",
    performedById: "e2",
    performedByName: "Rohan Mehta",
    description: "Booking BK-0002 checked out for Delivery Van.",
    details: JSON.stringify({ checkOutDate: "2026-07-12T08:05:00Z", notes: "Van keys and logbook collected from desk." })
  },
  {
    id: "AUD-0016",
    timestamp: "2026-07-12T10:00:00Z",
    module: "Booking",
    action: "Create Booking",
    assetId: "a1",
    assetName: "MacBook Pro 16\"",
    assetTag: "AF-0001",
    performedById: "e5",
    performedByName: "Priya Shah",
    description: "Booking BK-0001 created for MacBook Pro 16\" by Priya Shah.",
    details: JSON.stringify({ startDate: "2026-07-15", endDate: "2026-07-15" })
  }
];

export function getStoredAuditEntries(): AuditEntry[] {
  if (typeof window === "undefined") return initialAuditEntries;
  try {
    const stored = localStorage.getItem("assetflow_audit_logs");
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem("assetflow_audit_logs", JSON.stringify(initialAuditEntries));
      return initialAuditEntries;
    }
  } catch (error) {
    console.error("Error reading audit logs from localStorage:", error);
    return initialAuditEntries;
  }
}

export function saveAuditEntries(entries: AuditEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("assetflow_audit_logs", JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving audit logs to localStorage:", error);
  }
}

export function addAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp">) {
  const entries = getStoredAuditEntries();
  const nextNum = entries.length + 1;
  const newEntry: AuditEntry = {
    ...entry,
    id: `AUD-${String(nextNum).padStart(4, "0")}`,
    timestamp: new Date().toISOString()
  };
  entries.unshift(newEntry); // New logs at top
  saveAuditEntries(entries);
  return newEntry;
}

export function clearAuditEntries() {
  if (typeof window === "undefined") return;
  localStorage.setItem("assetflow_audit_logs", JSON.stringify([]));
}
