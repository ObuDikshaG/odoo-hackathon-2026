"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, Clock, Users } from "lucide-react";
import { Asset } from "@/lib/data/assetStore";
import { Allocation } from "@/lib/data/allocationStore";

interface AllocationKpiProps {
  assets: Asset[];
  allocations: Allocation[];
}

export function AllocationKpi({ assets, allocations }: AllocationKpiProps) {
  const totalAllocated = assets.filter((a) => a.status === "Allocated").length;
  const available = assets.filter((a) => a.status === "Available").length;
  
  // Pending Returns are allocations marked as Allocated/Pending that might be close or flagged for returns
  // For the ERP requirement, we'll calculate pending returns as any active allocation with "Pending" status
  const pendingReturns = allocations.filter((al) => al.status === "Pending").length;
  
  // Active employees with assets: unique count of employee IDs that currently hold an active allocation
  const activeEmployees = new Set(
    allocations
      .filter((al) => al.status === "Allocated" && al.employeeId)
      .map((al) => al.employeeId)
  ).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Allocated Assets</CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalAllocated}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently assigned items</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Assets</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{available}</div>
          <p className="text-xs text-muted-foreground mt-1">Ready for assignment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">{pendingReturns}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Employees with Assets</CardTitle>
          <Users className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">{activeEmployees}</div>
          <p className="text-xs text-muted-foreground mt-1">Unique staff members</p>
        </CardContent>
      </Card>
    </div>
  );
}
