export type MaintenancePriority = "Low" | "Medium" | "High" | "Critical";
export type MaintenanceStatus = "Open" | "In Progress" | "Completed" | "Overdue";
export type MaintenanceType = "Corrective" | "Preventive";

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  cost: number;
  requestDate: string;
  lastServiceDate: string | null;
  nextServiceDate: string | null;
  completionDate: string | null;
  notes?: string;
  createdAt: string;
}

export const initialMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "mr-1",
    assetId: "a3", // Delivery Van
    title: "Engine Diagnostics & Oil Change",
    description: "Inspect engine warning light, replace oil filter, perform general multi-point vehicle safety check.",
    type: "Corrective",
    priority: "High",
    status: "In Progress",
    cost: 350,
    requestDate: "2026-07-01",
    lastServiceDate: "2026-01-10",
    nextServiceDate: null,
    completionDate: null,
    notes: "Van has been running rough. Diagnostics in progress at warehouse garage.",
    createdAt: "2026-07-01T09:00:00Z"
  },
  {
    id: "mr-2",
    assetId: "a2", // Ergonomic Desk Chair
    title: "Caster Wheel Replacement",
    description: "Replaced 2 broken wheels on the base of the chair to restore stability.",
    type: "Corrective",
    priority: "Low",
    status: "Completed",
    cost: 45,
    requestDate: "2026-02-14",
    lastServiceDate: null,
    nextServiceDate: null,
    completionDate: "2026-02-15",
    notes: "Installed standard heavy-duty carpet casters. Restored to employee allocation.",
    createdAt: "2026-02-14T10:00:00Z"
  },
  {
    id: "mr-3",
    assetId: "a4", // Dell 27" Monitor
    title: "Color Calibration & Clean",
    description: "Schedule annual color accuracy calibration and panel dusting.",
    type: "Preventive",
    priority: "Medium",
    status: "Overdue",
    cost: 0,
    requestDate: "2026-06-01",
    lastServiceDate: "2025-06-01",
    nextServiceDate: "2026-07-05",
    completionDate: null,
    notes: "Scheduled calibration was missed due to office holiday closures.",
    createdAt: "2026-06-01T14:00:00Z"
  },
  {
    id: "mr-4",
    assetId: "a1", // MacBook Pro
    title: "Routine Dusting & Battery Diagnostics",
    description: "Annual cleaning of internal fans and battery cycle check.",
    type: "Preventive",
    priority: "Low",
    status: "Open",
    cost: 0,
    requestDate: "2026-07-10",
    lastServiceDate: "2025-07-10",
    nextServiceDate: "2026-07-25",
    completionDate: null,
    notes: "Part of the standard annual IT preventive inspection pipeline.",
    createdAt: "2026-07-10T08:30:00Z"
  }
];

export function getStoredMaintenanceRequests(): MaintenanceRequest[] {
  if (typeof window === "undefined") return initialMaintenanceRequests;
  try {
    const stored = localStorage.getItem("assetflow_maintenance");
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem("assetflow_maintenance", JSON.stringify(initialMaintenanceRequests));
      return initialMaintenanceRequests;
    }
  } catch (error) {
    console.error("Error reading maintenance requests from localStorage:", error);
    return initialMaintenanceRequests;
  }
}

export function saveMaintenanceRequests(requests: MaintenanceRequest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("assetflow_maintenance", JSON.stringify(requests));
  } catch (error) {
    console.error("Error saving maintenance requests to localStorage:", error);
  }
}
