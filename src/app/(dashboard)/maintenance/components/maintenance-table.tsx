"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, CheckCircle, History, Wrench } from "lucide-react";
import { MaintenanceRequest } from "@/lib/data/maintenanceStore";
import { Asset } from "@/lib/data/assetStore";

interface MaintenanceTableProps {
  requests: MaintenanceRequest[];
  assets: Asset[];
  onEdit: (request: MaintenanceRequest) => void;
  onCloseRequest: (request: MaintenanceRequest) => void;
  onViewHistory: (assetId: string) => void;
}

export function MaintenanceTable({
  requests,
  assets,
  onEdit,
  onCloseRequest,
  onViewHistory,
}: MaintenanceTableProps) {
  const getAssetDetails = (assetId: string) => {
    return assets.find((a) => a.id === assetId);
  };

  const getPriorityBadge = (priority: MaintenanceRequest["priority"]) => {
    switch (priority) {
      case "Low":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-none hover:bg-slate-100">Low</Badge>;
      case "Medium":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none hover:bg-blue-50">Medium</Badge>;
      case "High":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-none hover:bg-amber-50">High</Badge>;
      case "Critical":
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-none hover:bg-red-50">Critical</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (request: MaintenanceRequest) => {
    // Dynamically calculate overdue status if nextServiceDate is in the past and request is not completed
    let currentStatus = request.status;
    if (currentStatus !== "Completed" && request.nextServiceDate) {
      const today = new Date().toISOString().split("T")[0];
      if (request.nextServiceDate < today) {
        currentStatus = "Overdue";
      }
    }

    switch (currentStatus) {
      case "Open":
        return <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50/50">Open</Badge>;
      case "In Progress":
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white border-none">In Progress</Badge>;
      case "Completed":
        return <Badge variant="secondary" className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">Completed</Badge>;
      case "Overdue":
        return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-white border-none">Overdue</Badge>;
      default:
        return <Badge>{currentStatus}</Badge>;
    }
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cost);
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
              <TableHead className="font-semibold w-[100px]">Req ID</TableHead>
              <TableHead className="font-semibold">Asset Tag &amp; Name</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Next Service</TableHead>
              <TableHead className="font-semibold text-right">Cost</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Wrench className="h-8 w-8 text-muted-foreground/60 mb-1" />
                    <p className="font-medium">No maintenance requests found</p>
                    <p className="text-xs">Adjust filters or create a new service request.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => {
                const asset = getAssetDetails(r.assetId);
                return (
                  <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-bold text-xs">{r.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-xs text-muted-foreground">{asset?.tag || "-"}</span>
                        <span className="font-medium text-sm">{asset?.name || "Unknown Asset"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate" title={r.title}>
                      {r.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={r.type === "Preventive" ? "border-purple-300 text-purple-700 bg-purple-50/50" : "border-slate-300 text-slate-700 bg-slate-50/50"}>
                        {r.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(r.priority)}</TableCell>
                    <TableCell>{getStatusBadge(r)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{formatDate(r.nextServiceDate)}</TableCell>
                    <TableCell className="text-right font-semibold font-mono text-sm">{formatCost(r.cost)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => onEdit(r)} className="flex items-center gap-2">
                            <Edit className="h-3.5 w-3.5" /> Edit Request
                          </DropdownMenuItem>
                          {r.status !== "Completed" && (
                            <DropdownMenuItem onClick={() => onCloseRequest(r)} className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Close / Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onViewHistory(r.assetId)} className="flex items-center gap-2">
                            <History className="h-3.5 w-3.5" /> View Asset History
                          </DropdownMenuItem>
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
