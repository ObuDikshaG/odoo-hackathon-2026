"use client";

import { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  MoreHorizontal, 
  Archive, 
  Trash2, 
  User, 
  MapPin, 
  Wrench, 
  Activity
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet";

import { mockCategories, mockDepartments } from "@/lib/data/mock";
import { Asset, AssetStatus, getStoredAssets, saveAssets, generateNextAssetTag } from "@/lib/data/assetStore";
import { logEvent } from "@/lib/data/eventLogger";

export default function AssetsPage() {

  // Dialog & Sheet controllers
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Alert/Confirm controllers
  const [isRetireConfirmOpen, setIsRetireConfirmOpen] = useState(false);
  const [isDisposeConfirmOpen, setIsDisposeConfirmOpen] = useState(false);
  const [assetToTransition, setAssetToTransition] = useState<Asset | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  // Registration Form state
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    departmentId: "none",
    location: "HQ - 4th Floor",
    description: "",
    customFields: {} as Record<string, string | number>
  });

  // Predefined locations list
  const locations = [
    "HQ - 1st Floor",
    "HQ - 2nd Floor",
    "HQ - 4th Floor",
    "Warehouse A",
    "Warehouse B",
    "Remote"
  ];

  // Load assets on mount — use lazy initializer to avoid setState-in-effect lint rule
  const [assets, setAssets] = useState<Asset[]>(() => getStoredAssets());

  // Sync state helpers
  const handleSaveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    saveAssets(newAssets);
  };

  // Status Badge helpers
  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case "Available":
        return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white">Available</Badge>;
      case "Allocated":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">Allocated</Badge>;
      case "Under Maintenance":
        return <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-500">Maintenance</Badge>;
      case "Retired":
        return <Badge variant="ghost" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500">Retired</Badge>;
      case "Disposed":
        return <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600 text-white">Disposed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Lookup helpers
  const getCategoryName = (id: string) => {
    return mockCategories.find(c => c.id === id)?.name || "Unknown";
  };

  const getDepartmentName = (id: string | null) => {
    if (!id || id === "none") return "Unassigned";
    return mockDepartments.find(d => d.id === id)?.name || "Unknown";
  };

  // Form helpers
  const handleCategoryChange = (val: string | null) => {
    if (!val) return;
    const selectedCat = mockCategories.find(c => c.id === val);
    const defaults: Record<string, string | number> = {};
    if (selectedCat) {
      selectedCat.customFields.forEach(field => {
        defaults[field.name] = field.type === "number" ? "" : "";
      });
    }
    setFormData({
      ...formData,
      categoryId: val,
      customFields: defaults
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Asset name is required.");
      return;
    }
    if (!formData.categoryId) {
      setError("Asset category is required.");
      return;
    }

    const nextTag = generateNextAssetTag(assets);
    const newAsset: Asset = {
      id: `a-${Date.now()}`,
      tag: nextTag,
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      departmentId: formData.departmentId === "none" ? null : formData.departmentId,
      location: formData.location,
      description: formData.description.trim(),
      status: "Available", // Requirement 3: newly registered assets must start with Available status
      customFields: formData.customFields,
      createdAt: new Date().toISOString()
    };

    const updatedAssets = [...assets, newAsset];
    handleSaveAssets(updatedAssets);

    logEvent({
      module: "Asset",
      action: "Register",
      assetId: newAsset.id,
      performedById: "admin",
      performedByName: "System Admin",
      description: `Asset ${newAsset.tag} (${newAsset.name}) registered in inventory.`,
      details: { categoryId: newAsset.categoryId, location: newAsset.location, status: newAsset.status },
      createNotification: true,
      notificationTitle: "New Asset Registered",
      notificationPriority: "Low"
    });
    
    // Reset Form & Close
    setFormData({
      name: "",
      categoryId: "",
      departmentId: "none",
      location: "HQ - 4th Floor",
      description: "",
      customFields: {}
    });
    setIsAddDialogOpen(false);
  };

  // Soft delete actions: Retire / Dispose
  const handleRetireClick = (asset: Asset) => {
    setAssetToTransition(asset);
    setIsRetireConfirmOpen(true);
  };

  const confirmRetire = () => {
    if (!assetToTransition) return;
    const updated = assets.map(a => 
      a.id === assetToTransition.id ? { ...a, status: "Retired" as const } : a
    );
    handleSaveAssets(updated);

    logEvent({
      module: "Asset",
      action: "Retire",
      assetId: assetToTransition.id,
      performedById: "admin",
      performedByName: "System Admin",
      description: `Asset ${assetToTransition.tag} (${assetToTransition.name}) retired from inventory.`,
      details: { status: "Retired" },
      createNotification: true,
      notificationTitle: "Asset Retired",
      notificationPriority: "Medium"
    });
    
    // Update active details panel if open
    if (selectedAsset?.id === assetToTransition.id) {
      setSelectedAsset({ ...selectedAsset, status: "Retired" });
    }
    
    setIsRetireConfirmOpen(false);
    setAssetToTransition(null);
  };

  const handleDisposeClick = (asset: Asset) => {
    setAssetToTransition(asset);
    setIsDisposeConfirmOpen(true);
  };

  const confirmDispose = () => {
    if (!assetToTransition) return;
    const updated = assets.map(a => 
      a.id === assetToTransition.id ? { ...a, status: "Disposed" as const } : a
    );
    handleSaveAssets(updated);

    logEvent({
      module: "Asset",
      action: "Dispose",
      assetId: assetToTransition.id,
      performedById: "admin",
      performedByName: "System Admin",
      description: `Asset ${assetToTransition.tag} (${assetToTransition.name}) marked as Disposed.`,
      details: { status: "Disposed" },
      createNotification: true,
      notificationTitle: "Asset Disposed",
      notificationPriority: "High"
    });
    
    // Update active details panel if open
    if (selectedAsset?.id === assetToTransition.id) {
      setSelectedAsset({ ...selectedAsset, status: "Disposed" });
    }

    setIsDisposeConfirmOpen(false);
    setAssetToTransition(null);
  };

  // Filter lists calculations
  const uniqueLocationsInAssets = Array.from(
    new Set([...locations, ...assets.map(a => a.location)].filter(Boolean))
  );

  // Search & Filter application
  const filteredAssets = assets.filter((asset) => {
    // Search query matches Name, Tag, Description
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = filterCategory === "all" || asset.categoryId === filterCategory;
    const matchesStatus = filterStatus === "all" || asset.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || asset.departmentId === filterDepartment;
    const matchesLocation = filterLocation === "all" || asset.location === filterLocation;

    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment && matchesLocation;
  });

  const selectedCategoryFields = mockCategories.find(c => c.id === formData.categoryId)?.customFields || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Asset Directory</h1>
          <p className="text-muted-foreground">
            Manage enterprise hardware, software licenses, furniture, and vehicles.
          </p>
        </div>
        
        {/* Register Asset trigger button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Register Asset
            </Button>
          } />
          <DialogContent className="max-w-lg overflow-y-auto max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>Register Asset</DialogTitle>
              <DialogDescription>
                Add a new asset to your organization&apos;s directory. It will start with status &quot;Available&quot;.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegister} className="space-y-4 py-2">
              {error && (
                <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
                  {error}
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="tag-calc">Asset Tag (Auto-generated)</Label>
                <Input 
                  id="tag-calc" 
                  value={generateNextAssetTag(assets)} 
                  disabled 
                  className="bg-muted text-muted-foreground"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Asset Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Dell Latitude 7440" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Category <span className="text-destructive">*</span></Label>
                <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Department Assignment</Label>
                <Select value={formData.departmentId} onValueChange={(val) => setFormData({ ...formData, departmentId: val ?? "none" })}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {mockDepartments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Location</Label>
                <Select value={formData.location} onValueChange={(val) => setFormData({ ...formData, location: val ?? formData.location })}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Optional details, serial numbers, notes..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Dynamic Custom Fields based on Category */}
              {selectedCategoryFields.length > 0 && (
                <div className="space-y-4 pt-2 border-t">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category Specifications: {getCategoryName(formData.categoryId)}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCategoryFields.map((field) => (
                      <div key={field.name} className="grid gap-1.5">
                        <Label htmlFor={`custom-${field.name}`}>{field.name}</Label>
                        <Input
                          id={`custom-${field.name}`}
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                          value={formData.customFields[field.name] || ""}
                          onChange={(e) => {
                            const val = field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
                            setFormData({
                              ...formData,
                              customFields: {
                                ...formData.customFields,
                                [field.name]: val
                              }
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <div className="bg-card p-4 rounded-xl border space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters & Search</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets..." 
              className="pl-8 h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val ?? "all")}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Category: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category: All</SelectItem>
                {mockCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val ?? "all")}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Allocated">Allocated</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Disposed">Disposed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterDepartment} onValueChange={(val) => setFilterDepartment(val ?? "all")}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Department: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Department: All</SelectItem>
                {mockDepartments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterLocation} onValueChange={(val) => setFilterLocation(val ?? "all")}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Location: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Location: All</SelectItem>
                {uniqueLocationsInAssets.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Asset Tag</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Registered</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Package className="h-8 w-8 text-muted-foreground/60 mb-1" />
                      <p className="font-medium">No assets found</p>
                      <p className="text-xs">Adjust your search or filter values, or register a new asset.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold text-xs">{asset.tag}</TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{getCategoryName(asset.categoryId)}</TableCell>
                    <TableCell>{getDepartmentName(asset.departmentId)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{asset.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(asset.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => {
                            setSelectedAsset(asset);
                            setIsDetailsOpen(true);
                          }} className="flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </DropdownMenuItem>
                          
                          {/* Disable retire/dispose for retired/disposed assets */}
                          {asset.status !== "Retired" && asset.status !== "Disposed" && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleRetireClick(asset)} 
                                className="flex items-center gap-2 text-muted-foreground"
                              >
                                <Archive className="h-3.5 w-3.5" /> Mark as Retired
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDisposeClick(asset)} 
                                className="flex items-center gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Mark as Disposed
                              </DropdownMenuItem>
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
      </div>

      {/* Retire Confirmation Dialog */}
      <AlertDialog open={isRetireConfirmOpen} onOpenChange={setIsRetireConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark asset as Retired?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to retire <strong>{assetToTransition?.name}</strong> ({assetToTransition?.tag})? 
              This indicates the asset is taken out of service, but its full history remains preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAssetToTransition(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRetire} className="bg-amber-600 hover:bg-amber-700 text-white">
              Retire Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dispose Confirmation Dialog */}
      <AlertDialog open={isDisposeConfirmOpen} onOpenChange={setIsDisposeConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark asset as Disposed?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to dispose of <strong>{assetToTransition?.name}</strong> ({assetToTransition?.tag})? 
              This will update its status to Disposed. The asset record, allocation history, and maintenance records will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAssetToTransition(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDispose} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Dispose Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Asset Details Slide Panel (Sheet) */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="right" className="w-[95%] sm:max-w-[480px] p-0 flex flex-col h-full bg-background border-l shadow-2xl">
          {selectedAsset && (
            <div className="flex flex-col h-full">
              {/* Header section */}
              <div className="p-6 border-b bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm bg-muted px-2 py-0.5 rounded text-muted-foreground border">
                    {selectedAsset.tag}
                  </span>
                  {getStatusBadge(selectedAsset.status)}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">{selectedAsset.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered: {new Date(selectedAsset.createdAt).toLocaleString(undefined, { 
                    dateStyle: 'medium', 
                    timeStyle: 'short' 
                  })}
                </p>
              </div>

              {/* Main details content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Basic Fields */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset Properties</h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border text-xs">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium text-foreground">{getCategoryName(selectedAsset.categoryId)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium text-foreground">{getDepartmentName(selectedAsset.departmentId)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{selectedAsset.location}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Description</p>
                      <p className="font-medium text-foreground line-clamp-2" title={selectedAsset.description}>
                        {selectedAsset.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom Fields (dynamic specifications) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Specifications</h3>
                  {Object.keys(selectedAsset.customFields).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 border p-3 rounded-lg text-xs">
                      {Object.entries(selectedAsset.customFields).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-muted-foreground">{key}</p>
                          <p className="font-semibold text-foreground">
                            {typeof val === 'number' && key.toLowerCase().includes('warranty') ? `${val} Months` : String(val)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground border p-3 rounded-lg italic text-center">
                      No custom fields required for this category.
                    </div>
                  )}
                </div>

                {/* Requirement 8: Allocation History Placeholder */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Allocation History</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-card text-xs">
                    {/* Render a mock history for the Allocated asset AF-0002 for visual quality, otherwise empty placeholder */}
                    {selectedAsset.tag === "AF-0002" ? (
                      <div className="divide-y">
                        <div className="p-3 bg-muted/10">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium flex items-center gap-1">
                              <User className="h-3 w-3" /> Priya Shah
                            </span>
                            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] h-4">Active</Badge>
                          </div>
                          <p className="text-muted-foreground text-[10px]">Assigned on Feb 15, 2026</p>
                          <p className="text-muted-foreground text-[10px] mt-0.5">Location: HQ - 2nd Floor</p>
                        </div>
                        <div className="p-3 text-muted-foreground/60">
                          <div className="flex justify-between items-center mb-0.5">
                            <span>Returned by Aditi Rao</span>
                            <span>Jan 28, 2026</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground italic">
                        No allocation logs recorded.
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirement 8: Maintenance History Placeholder */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Maintenance History</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-card text-xs">
                    {/* Render a mock maintenance history for visual quality */}
                    {selectedAsset.tag === "AF-0003" ? (
                      <div className="divide-y">
                        <div className="p-3 bg-muted/10">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Engine Tuning & Servicing</span>
                            <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-[10px] h-4">In Progress</Badge>
                          </div>
                          <p className="text-muted-foreground text-[10px]">Scheduled: Jul 15, 2026</p>
                          <p className="text-muted-foreground text-[10px] mt-0.5">Estimated Cost: $350.00</p>
                        </div>
                      </div>
                    ) : selectedAsset.tag === "AF-0001" ? (
                      <div className="divide-y">
                        <div className="p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Battery Replacement</span>
                            <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] h-4">Completed</Badge>
                          </div>
                          <p className="text-muted-foreground text-[10px]">Date: Apr 12, 2026</p>
                          <p className="text-muted-foreground text-[10px] mt-0.5">Cost: $120.00 • Done by Apple Auth Service</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground italic">
                        No maintenance records found.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Section with Retire / Dispose quick actions */}
              {selectedAsset.status !== "Retired" && selectedAsset.status !== "Disposed" && (
                <div className="p-4 border-t bg-muted/20 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs h-9" 
                    onClick={() => handleRetireClick(selectedAsset)}
                  >
                    <Archive className="h-3.5 w-3.5" /> Retire Asset
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs h-9" 
                    onClick={() => handleDisposeClick(selectedAsset)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Dispose Asset
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
