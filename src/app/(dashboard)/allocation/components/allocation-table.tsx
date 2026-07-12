"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Calendar, ArrowRight, PackageOpen } from "lucide-react";
import { Allocation } from "@/lib/data/allocationStore";
import { Asset } from "@/lib/data/assetStore";
import { mockCategories, mockDepartments, mockEmployees } from "@/lib/data/mock";

interface AllocationTableProps {
  allocations: Allocation[];
  assets: Asset[];
  onViewDetails: (allocation: Allocation) => void;
  onTransfer: (allocation: Allocation) => void;
  onReturn: (allocation: Allocation) => void;
}

export function AllocationTable({
  allocations,
  assets,
  onViewDetails,
  onTransfer,
  onReturn,
}: AllocationTableProps) {
  const getAssetDetails = (assetId: string) => {
    return assets.find((a) => a.id === assetId);
  };

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "-";
    return mockCategories.find((c) => c.id === categoryId)?.name || "-";
  };

  const getEmployeeName = (employeeId: string | null) => {
    if (!employeeId) return "-";
    return mockEmployees.find((e) => e.id === employeeId)?.name || "-";
  };

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return "-";
    return mockDepartments.find((d) => d.id === deptId)?.name || "-";
  };

  const getStatusBadge = (status: Allocation["status"]) => {
    switch (status) {
      case "Allocated":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">Allocated</Badge>;
      case "Returned":
        return <Badge variant="secondary" className="bg-emerald-500 hover:bg-emerald-600 text-white">Returned</Badge>;
      case "Pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Pending Return</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Asset Tag</TableHead>
              <TableHead className="font-semibold">Asset Name</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Employee</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Allocation Date</TableHead>
              <TableHead className="font-semibold">Return Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <PackageOpen className="h-8 w-8 text-muted-foreground/60 mb-1" />
                    <p className="font-medium">No allocation records found</p>
                    <p className="text-xs">Adjust your search filters or assign a new asset.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              allocations.map((al) => {
                const asset = getAssetDetails(al.assetId);
                return (
                  <TableRow key={al.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold text-xs">{asset?.tag || "-"}</TableCell>
                    <TableCell className="font-medium">{asset?.name || "Unknown Asset"}</TableCell>
                    <TableCell>{getCategoryName(asset?.categoryId)}</TableCell>
                    <TableCell>{getEmployeeName(al.employeeId)}</TableCell>
                    <TableCell>{getDepartmentName(al.departmentId)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{formatDate(al.allocationDate)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{formatDate(al.returnDate)}</TableCell>
                    <TableCell>{getStatusBadge(al.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onViewDetails(al)} className="flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </DropdownMenuItem>
                          {al.status !== "Returned" && (
                            <>
                              <DropdownMenuItem onClick={() => onTransfer(al)} className="flex items-center gap-2">
                                <ArrowRight className="h-3.5 w-3.5" /> Transfer Asset
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onReturn(al)} className="flex items-center gap-2 text-destructive focus:text-destructive">
                                <Calendar className="h-3.5 w-3.5" /> Return Asset
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
