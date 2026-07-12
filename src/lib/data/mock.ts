export type Role = "Admin" | "Asset Manager" | "Department Head" | "Employee";
export type Status = "Active" | "Inactive";

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string | null;
  role: Role;
  status: Status;
}

export interface Department {
  id: string;
  name: string;
  headId: string | null;
  parentId: string | null;
  status: Status;
}

export interface AssetCategory {
  id: string;
  name: string;
  customFields: { name: string; type: string }[];
}

export const mockEmployees: Employee[] = [
  { id: "e1", name: "Aditi Rao", email: "aditi@company.com", departmentId: "d1", role: "Department Head", status: "Active" },
  { id: "e2", name: "Rohan Mehta", email: "rohan@company.com", departmentId: "d2", role: "Department Head", status: "Active" },
  { id: "e3", name: "Sana Iqbal", email: "sana@company.com", departmentId: "d3", role: "Department Head", status: "Active" },
  { id: "e4", name: "Admin User", email: "admin@company.com", departmentId: null, role: "Admin", status: "Active" },
  { id: "e5", name: "Priya Shah", email: "priya@company.com", departmentId: "d1", role: "Employee", status: "Active" },
  { id: "e6", name: "Asset Manager 1", email: "asset.manager@company.com", departmentId: null, role: "Asset Manager", status: "Active" }
];

export const mockDepartments: Department[] = [
  { id: "d1", name: "Engineering", headId: "e1", parentId: null, status: "Active" },
  { id: "d2", name: "Facilities", headId: "e2", parentId: null, status: "Active" },
  { id: "d4", name: "Field Ops", headId: null, parentId: null, status: "Active" },
  { id: "d3", name: "Field Ops (East)", headId: "e3", parentId: "d4", status: "Inactive" },
];

export const mockCategories: AssetCategory[] = [
  { id: "c1", name: "Electronics", customFields: [{ name: "Warranty Period", type: "number" }, { name: "OS", type: "string" }] },
  { id: "c2", name: "Furniture", customFields: [{ name: "Material", type: "string" }] },
  { id: "c3", name: "Vehicles", customFields: [{ name: "License Plate", type: "string" }, { name: "Mileage", type: "number" }] },
  { id: "c4", name: "IT Equipment", customFields: [{ name: "MAC Address", type: "string" }] },
  { id: "c5", name: "Office Supplies", customFields: [] },
];
