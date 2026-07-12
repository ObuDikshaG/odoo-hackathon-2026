"use client";

import { useState } from "react";
import { Employee, Department, Role } from "@/lib/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, UserCheck, UserPlus, Shield, ArrowUpDown } from "lucide-react";

interface EmployeesTabProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  departments: Department[];
}

function generateEmployeeId() {
  return `e-${Math.random().toString(36).substr(2, 9)}`;
}

export function EmployeesTab({ employees, setEmployees, departments }: EmployeesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState<Employee | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    email: "",
    departmentId: null,
    status: "Active",
  });

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return "-";
    return departments.find(d => d.id === deptId)?.name || "-";
  };

  const handleSave = () => {
    setError(null);
    if (!formData.name?.trim()) {
      setError("Name is required.");
      return;
    }
    if (!formData.email?.trim()) {
      setError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.id) {
      setEmployees(employees.map(e => e.id === formData.id ? { ...e, ...formData } as Employee : e));
    } else {
      const newId = generateEmployeeId();
      setEmployees([...employees, { ...formData, id: newId, role: "Employee" } as Employee]);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setError(null);
    setFormData({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      departmentId: employee.departmentId,
      status: employee.status,
    });
    setIsDialogOpen(true);
  };

  const handleRoleChange = (employeeId: string, newRole: Role) => {
    setEmployees(employees.map(e => e.id === employeeId ? { ...e, role: newRole } : e));
  };

  const handleDeactivateRequest = (employee: Employee) => {
    setEmployeeToDeactivate(employee);
    setIsAlertOpen(true);
  };

  const confirmDeactivate = () => {
    if (employeeToDeactivate) {
      setEmployees(employees.map(e => e.id === employeeToDeactivate.id ? { ...e, status: "Inactive" } : e));
    }
    setIsAlertOpen(false);
    setEmployeeToDeactivate(null);
  };

  const resetForm = () => {
    setError(null);
    setFormData({ name: "", email: "", departmentId: null, status: "Active" });
  };

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedEmployees = employees
    .filter((emp) => {
      const matchName = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchEmail = emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchName || matchEmail;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      let valA: string = "";
      let valB: string = "";

      if (sortField === "name") {
        valA = a.name; valB = b.name;
      } else if (sortField === "email") {
        valA = a.email; valB = b.email;
      } else if (sortField === "departmentId") {
        valA = getDepartmentName(a.departmentId); valB = getDepartmentName(b.departmentId);
      } else if (sortField === "role") {
        valA = a.role; valB = b.role;
      } else if (sortField === "status") {
        valA = a.status; valB = b.status;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Search employees..." 
          className="max-w-sm" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={<Button>+ Add Employee</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Employee" : "Add Employee"}</DialogTitle>
              <DialogDescription>
                {formData.id 
                  ? "Update employee details. Roles can only be changed via promotions." 
                  : "Add a new employee. They will be assigned the 'Employee' role by default."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="emp-name">Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="emp-name" 
                  value={formData.name || ""} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emp-email">Email <span className="text-destructive">*</span></Label>
                <Input 
                  id="emp-email" 
                  type="email"
                  value={formData.email || ""} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select 
                  value={formData.departmentId || "none"} 
                  onValueChange={(val) => val && setFormData({...formData, departmentId: val === "none" ? null : val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => val && setFormData({...formData, status: val as "Active" | "Inactive"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("email")}>
                <div className="flex items-center gap-1">Email <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("departmentId")}>
                <div className="flex items-center gap-1">Department <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("role")}>
                <div className="flex items-center gap-1">Role <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No employees found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{getDepartmentName(emp.departmentId)}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      emp.role === "Admin" ? "bg-purple-100 text-purple-800" :
                      emp.role === "Asset Manager" ? "bg-blue-100 text-blue-800" :
                      emp.role === "Department Head" ? "bg-orange-100 text-orange-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {emp.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={emp.status === "Active" ? "default" : "secondary"}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(emp)}>Edit Details</DropdownMenuItem>
                        
                        {emp.role !== "Admin" && (
                          <>
                            <DropdownMenuSeparator />
                            {emp.role !== "Asset Manager" && (
                              <DropdownMenuItem onClick={() => handleRoleChange(emp.id, "Asset Manager")}>
                                <Shield className="h-4 w-4 mr-2" /> Promote to Asset Manager
                              </DropdownMenuItem>
                            )}
                            {emp.role !== "Department Head" && (
                              <DropdownMenuItem onClick={() => handleRoleChange(emp.id, "Department Head")}>
                                <UserCheck className="h-4 w-4 mr-2" /> Promote to Dept Head
                              </DropdownMenuItem>
                            )}
                            {emp.role !== "Employee" && (
                              <DropdownMenuItem onClick={() => handleRoleChange(emp.id, "Employee")}>
                                <UserPlus className="h-4 w-4 mr-2" /> Revert to Employee
                              </DropdownMenuItem>
                            )}
                            {emp.status === "Active" && (
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivateRequest(emp)}>
                                Deactivate
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {employeeToDeactivate?.name}?
              They will lose access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEmployeeToDeactivate(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDeactivate}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
