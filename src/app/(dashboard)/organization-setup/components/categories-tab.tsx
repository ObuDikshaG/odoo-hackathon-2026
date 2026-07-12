"use client";

import { useState } from "react";
import { AssetCategory } from "@/lib/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoriesTabProps {
  categories: AssetCategory[];
  setCategories: (categories: AssetCategory[]) => void;
}

export function CategoriesTab({ categories, setCategories }: CategoriesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<AssetCategory | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof AssetCategory | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AssetCategory>>({
    name: "",
    customFields: [],
  });

  const handleSave = () => {
    setError(null);
    if (!formData.name?.trim()) {
      setError("Category name is required.");
      return;
    }

    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === formData.name?.trim().toLowerCase() && c.id !== formData.id
    );
    if (isDuplicate) {
      setError("A category with this name already exists.");
      return;
    }

    // validate custom fields
    const hasEmptyField = formData.customFields?.some(f => !f.name.trim());
    if (hasEmptyField) {
      setError("Custom field names cannot be empty.");
      return;
    }

    if (formData.id) {
      setCategories(categories.map(c => c.id === formData.id ? { ...c, ...formData } as AssetCategory : c));
    } else {
      const newId = `c${crypto.randomUUID()}`;
      setCategories([...categories, { ...formData, id: newId } as AssetCategory]);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (category: AssetCategory) => {
    setError(null);
    setFormData(category);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (category: AssetCategory) => {
    setCategoryToDelete(category);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
    }
    setIsAlertOpen(false);
    setCategoryToDelete(null);
  };

  const resetForm = () => {
    setError(null);
    setFormData({ name: "", customFields: [] });
  };

  const addCustomField = () => {
    setFormData({
      ...formData,
      customFields: [...(formData.customFields || []), { name: "", type: "string" }]
    });
  };

  const removeCustomField = (index: number) => {
    const newFields = [...(formData.customFields || [])];
    newFields.splice(index, 1);
    setFormData({ ...formData, customFields: newFields });
  };

  const updateCustomField = (index: number, field: string, value: string) => {
    const newFields = [...(formData.customFields || [])];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData({ ...formData, customFields: newFields });
  };

  const handleSort = (field: keyof AssetCategory) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedCategories = categories
    .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (!sortField) return 0;
      let valA: string | number = a[sortField] as string | number;
      let valB: string | number = b[sortField] as string | number;

      if (sortField === "customFields") {
        valA = a.customFields.length;
        valB = b.customFields.length;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Search categories..." 
          className="max-w-sm" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={<Button>+ Add</Button>} />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Category" : "Add Category"}</DialogTitle>
              <DialogDescription>
                Configure asset categories and optional custom fields.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-name">Category Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="cat-name" 
                  value={formData.name || ""} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label>Custom Fields</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
                    <Plus className="h-4 w-4 mr-1" /> Add Field
                  </Button>
                </div>
                {formData.customFields?.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No custom fields defined.</p>
                )}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {formData.customFields?.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input 
                        placeholder="Field Name" 
                        value={field.name}
                        onChange={(e) => updateCustomField(idx, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Select 
                        value={field.type} 
                        onValueChange={(val) => val && updateCustomField(idx, "type", val)}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomField(idx)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
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
                <div className="flex items-center gap-1">Category Name <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("customFields")}>
                <div className="flex items-center gap-1">Custom Fields <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No categories found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>
                    {cat.customFields.length > 0 
                      ? cat.customFields.map(f => f.name).join(", ") 
                      : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(cat)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRequest(cat)}>Delete</DropdownMenuItem>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the asset category &quot;{categoryToDelete?.name}&quot;.
              Ensure no assets are currently using this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
