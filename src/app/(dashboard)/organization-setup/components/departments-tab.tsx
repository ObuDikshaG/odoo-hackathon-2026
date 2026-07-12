"use client";

import { useState } from "react";
import { Department, Employee } from "@/lib/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

interface DepartmentsTabProps {
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  employees: Employee[];
}

export function DepartmentsTab({ departments, setDepartments, employees }: DepartmentsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Department | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Department>>({
    name: "",
    headId: null,
    parentId: null,
    status: "Active",
  });

  const getHeadName = (headId: string | null) => {
    if (!headId) return "-";
    return employees.find(e => e.id === headId)?.name || "-";
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return "-";
    return departments.find(d => d.id === parentId)?.name || "-";
  };

  const handleSave = () => {
    setError(null);
    if (!formData.name?.trim()) {
      setError("Department name is required.");
      return;
    }
    
    // Check for duplicate names
    const isDuplicate = departments.some(
      (d) => d.name.toLowerCase() === formData.name?.trim().toLowerCase() && d.id !== formData.id
    );
    if (isDuplicate) {
      setError("A department with this name already exists.");
      return;
    }

    // Check for circular reference in parent
    if (formData.id && formData.parentId === formData.id) {
      setError("A department cannot be its own parent.");
      return;
    }

    if (formData.id) {
      setDepartments(departments.map(d => d.id === formData.id ? { ...d, ...formData } as Department : d));
    } else {
      const newId = `d${Date.now()}`;
      setDepartments([...departments, { ...formData, id: newId } as Department]);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (dept: Department) => {
    setError(null);
    setFormData(dept);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (dept: Department) => {
    setDepartmentToDelete(dept);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      // Delete or Deactivate? The prompt said "Confirmation dialog before delete/deactivate". Let's do deactivate if we want to preserve data, or delete if they click delete. 
      // Let's implement actual delete for this example to match "delete"
      setDepartments(departments.filter((d) => d.id !== departmentToDelete.id));
    }
    setIsAlertOpen(false);
    setDepartmentToDelete(null);
  };

  const resetForm = () => {
    setError(null);
    setFormData({ name: "", headId: null, parentId: null, status: "Active" });
  };

  const handleSort = (field: keyof Department) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort
  const filteredAndSortedDepartments = departments
    .filter((dept) => {
      const matchName = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchHead = getHeadName(dept.headId).toLowerCase().includes(searchQuery.toLowerCase());
      return matchName || matchHead;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let valA: string = "";
      let valB: string = "";

      if (sortField === "name") {
        valA = a.name; valB = b.name;
      } else if (sortField === "headId") {
        valA = getHeadName(a.headId); valB = getHeadName(b.headId);
      } else if (sortField === "parentId") {
        valA = getParentName(a.parentId); valB = getParentName(b.parentId);
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
          placeholder="Search departments..." 
          className="max-w-sm" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={<Button>+ Add</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Department" : "Add Department"}</DialogTitle>
              <DialogDescription>
                Fill in the details for the department.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  value={formData.name || ""} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label>Parent Department</Label>
                <Select 
                  value={formData.parentId || "none"} 
                  onValueChange={(val) => val && setFormData({...formData, parentId: val === "none" ? null : val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {departments.filter(d => d.id !== formData.id).map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Department Head</Label>
                <Select 
                  value={formData.headId || "none"} 
                  onValueChange={(val) => val && setFormData({...formData, headId: val === "none" ? null : val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department head" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
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
                <div className="flex items-center gap-1">Department <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("headId")}>
                <div className="flex items-center gap-1">Head <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("parentId")}>
                <div className="flex items-center gap-1">Parent Dept <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No departments found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{getHeadName(dept.headId)}</TableCell>
                  <TableCell>{getParentName(dept.parentId)}</TableCell>
                  <TableCell>
                    <Badge variant={dept.status === "Active" ? "default" : "secondary"}>
                      {dept.status}
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
                        <DropdownMenuItem onClick={() => handleEdit(dept)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRequest(dept)}>Delete</DropdownMenuItem>
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department
              &quot;{departmentToDelete?.name}&quot; and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDepartmentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
