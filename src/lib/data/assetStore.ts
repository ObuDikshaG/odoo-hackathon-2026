export type AssetStatus = "Available" | "Allocated" | "Under Maintenance" | "Retired" | "Disposed";

export interface Asset {
  id: string;
  tag: string;
  name: string;
  categoryId: string;
  departmentId: string | null;
  location: string;
  description: string;
  status: AssetStatus;
  customFields: Record<string, any>;
  createdAt: string;
}

export const initialAssets: Asset[] = [
  {
    id: "a1",
    tag: "AF-0001",
    name: "MacBook Pro 16\"",
    categoryId: "c1",
    departmentId: "d1",
    location: "HQ - 4th Floor",
    description: "M2 Max, 32GB RAM, 1TB SSD. Standard issue for engineers.",
    status: "Available",
    customFields: { "Warranty Period": 24, "OS": "macOS" },
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "a2",
    tag: "AF-0002",
    name: "Ergonomic Desk Chair",
    categoryId: "c2",
    departmentId: "d2",
    location: "HQ - 2nd Floor",
    description: "Steelcase Gesture chair with lumbar support.",
    status: "Allocated",
    customFields: { "Material": "Mesh" },
    createdAt: "2026-02-15T11:30:00Z"
  },
  {
    id: "a3",
    tag: "AF-0003",
    name: "Delivery Van",
    categoryId: "c3",
    departmentId: "d4",
    location: "Warehouse A",
    description: "Ford Transit Cargo Van used for logistics.",
    status: "Under Maintenance",
    customFields: { "License Plate": "MH-12-AB-1234", "Mileage": 45000 },
    createdAt: "2026-03-01T09:00:00Z"
  },
  {
    id: "a4",
    tag: "AF-0004",
    name: "Dell 27\" UltraSharp Monitor",
    categoryId: "c4",
    departmentId: "d1",
    location: "HQ - 4th Floor",
    description: "4K USB-C hub monitor.",
    status: "Available",
    customFields: { "MAC Address": "00:1A:2B:3C:4D:5E" },
    createdAt: "2026-03-10T14:20:00Z"
  },
  {
    id: "a5",
    tag: "AF-0005",
    name: "Heavy Duty Office Desk",
    categoryId: "c2",
    departmentId: "d2",
    location: "Warehouse B",
    description: "L-shaped wooden executive desk.",
    status: "Retired",
    customFields: { "Material": "Oak Wood" },
    createdAt: "2026-04-05T16:45:00Z"
  }
];

export function getStoredAssets(): Asset[] {
  if (typeof window === "undefined") return initialAssets;
  try {
    const stored = localStorage.getItem("assetflow_assets");
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem("assetflow_assets", JSON.stringify(initialAssets));
      return initialAssets;
    }
  } catch (error) {
    console.error("Error reading assets from localStorage:", error);
    return initialAssets;
  }
}

export function saveAssets(assets: Asset[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("assetflow_assets", JSON.stringify(assets));
  } catch (error) {
    console.error("Error saving assets to localStorage:", error);
  }
}

export function generateNextAssetTag(assets: Asset[]): string {
  let maxNum = 0;
  assets.forEach((asset) => {
    const match = asset.tag.match(/^AF-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  });
  const nextNum = maxNum + 1;
  return `AF-${String(nextNum).padStart(4, "0")}`;
}
