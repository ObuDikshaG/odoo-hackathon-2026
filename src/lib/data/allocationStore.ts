export interface Allocation {
  id: string;
  assetId: string;
  employeeId: string | null;     // Assigned employee (if allocated to a person)
  departmentId: string | null;   // Assigned department (if allocated to department/office)
  allocationDate: string;
  returnDate: string | null;
  status: "Allocated" | "Returned" | "Pending";
  notes?: string;
  createdAt: string;
}

export const initialAllocations: Allocation[] = [
  {
    id: "al-1",
    assetId: "a2", // Steelcase Gesture Chair
    employeeId: "e5", // Priya Shah
    departmentId: "d2", // Facilities
    allocationDate: "2026-02-15",
    returnDate: null,
    status: "Allocated",
    notes: "Allocated standard office chair to Priya Shah at Facilities department.",
    createdAt: "2026-02-15T11:30:00Z"
  }
];

export function getStoredAllocations(): Allocation[] {
  if (typeof window === "undefined") return initialAllocations;
  try {
    const stored = localStorage.getItem("assetflow_allocations");
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem("assetflow_allocations", JSON.stringify(initialAllocations));
      return initialAllocations;
    }
  } catch (error) {
    console.error("Error reading allocations from localStorage:", error);
    return initialAllocations;
  }
}

export function saveAllocations(allocations: Allocation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("assetflow_allocations", JSON.stringify(allocations));
  } catch (error) {
    console.error("Error saving allocations to localStorage:", error);
  }
}
