"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuditEntry } from "@/lib/data/auditStore";
import { FileText, User, Calendar, Tag, ShieldCheck, HelpCircle } from "lucide-react";

interface AuditTableProps {
  entries: AuditEntry[];
}

export function AuditTable({ entries }: AuditTableProps) {
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const getModuleBadge = (mod: string) => {
    switch (mod) {
      case "Asset":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Asset</Badge>;
      case "Allocation":
        return <Badge className="bg-purple-500 hover:bg-purple-600 text-white">Allocation</Badge>;
      case "Maintenance":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Maintenance</Badge>;
      case "Booking":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Booking</Badge>;
      case "Organization":
        return <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white">Organization</Badge>;
      default:
        return <Badge variant="secondary">{mod}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("register")) {
      return <Badge variant="outline" className="border-emerald-500 text-emerald-600">Register</Badge>;
    }
    if (act.includes("delete") || act.includes("retire") || act.includes("dispose")) {
      return <Badge variant="outline" className="border-rose-500 text-rose-600">Retire</Badge>;
    }
    if (act.includes("update") || act.includes("edit")) {
      return <Badge variant="outline" className="border-blue-500 text-blue-600">Update</Badge>;
    }
    if (act.includes("allocate")) {
      return <Badge variant="outline" className="border-purple-500 text-purple-600">Allocate</Badge>;
    }
    if (act.includes("return")) {
      return <Badge variant="outline" className="border-teal-500 text-teal-600">Return</Badge>;
    }
    return <Badge variant="outline" className="border-muted-foreground">{action}</Badge>;
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    } catch {
      return isoString;
    }
  };

  // Helper to render parsed JSON details
  const renderParsedDetails = (detailsStr?: string) => {
    if (!detailsStr) return <span className="text-muted-foreground italic text-sm">No extra details logged.</span>;
    try {
      const parsed = JSON.parse(detailsStr);
      if (typeof parsed === "object" && parsed !== null) {
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-muted/50 rounded-lg p-3 border">
            {Object.entries(parsed).map(([key, val]) => {
              const displayVal = typeof val === "object" ? JSON.stringify(val) : String(val);
              return (
                <div key={key} className="col-span-2 sm:col-span-1 border-b pb-1 sm:border-0 sm:pb-0">
                  <span className="font-semibold text-muted-foreground capitalize text-xs block">{key}</span>
                  <span className="font-medium text-foreground text-sm block truncate" title={displayVal}>
                    {displayVal}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
    } catch {
      // Not JSON
    }
    return (
      <div className="bg-muted/50 rounded-lg p-3 border font-mono text-xs whitespace-pre-wrap">
        {detailsStr}
      </div>
    );
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[110px]">Log ID</TableHead>
              <TableHead className="w-[110px]">Module</TableHead>
              <TableHead className="w-[110px]">Action</TableHead>
              <TableHead className="w-[180px]">Target Asset</TableHead>
              <TableHead className="w-[150px]">Performed By</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No audit entries found matching the current filters.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <TableCell className="font-medium text-muted-foreground text-xs whitespace-nowrap">
                    {formatTimestamp(entry.timestamp)}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{entry.id}</TableCell>
                  <TableCell>{getModuleBadge(entry.module)}</TableCell>
                  <TableCell>{getActionBadge(entry.action)}</TableCell>
                  <TableCell>
                    {entry.assetId ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{entry.assetName}</span>
                        <span className="font-mono text-xs text-muted-foreground">{entry.assetTag}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{entry.performedByName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                    {entry.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Audit Log Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        {selectedEntry && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Audit Trail Log Detail
              </DialogTitle>
              <DialogDescription>
                Detailed overview of audit event {selectedEntry.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <Calendar className="h-3.5 w-3.5" /> TIMESTAMP
                  </span>
                  <span className="text-sm font-medium">
                    {formatTimestamp(selectedEntry.timestamp)}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <FileText className="h-3.5 w-3.5" /> LOG IDENTIFIER
                  </span>
                  <span className="text-sm font-mono font-bold">{selectedEntry.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <HelpCircle className="h-3.5 w-3.5" /> MODULE & ACTION
                  </span>
                  <div className="flex items-center gap-2">
                    {getModuleBadge(selectedEntry.module)}
                    {getActionBadge(selectedEntry.action)}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="h-3.5 w-3.5" /> PERFORMED BY
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{selectedEntry.performedByName}</span>
                    <span className="text-xs text-muted-foreground font-mono">({selectedEntry.performedById})</span>
                  </div>
                </div>
              </div>

              {selectedEntry.assetId && (
                <div className="border-b pb-4">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
                    <Tag className="h-3.5 w-3.5" /> TARGET ASSET
                  </span>
                  <div className="bg-muted/40 rounded-lg p-2 border flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm block">{selectedEntry.assetName}</span>
                      <span className="font-mono text-xs text-muted-foreground block">{selectedEntry.assetTag}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">ID: {selectedEntry.assetId}</Badge>
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-1">DESCRIPTION</span>
                <p className="text-sm font-medium p-3 bg-primary/5 border border-primary/10 rounded-lg text-primary">
                  {selectedEntry.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-2">METADATA DETAILS</span>
                {renderParsedDetails(selectedEntry.details)}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
