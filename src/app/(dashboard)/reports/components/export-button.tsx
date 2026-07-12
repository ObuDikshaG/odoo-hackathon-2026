"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Printer, CheckCircle2 } from "lucide-react";

export function ExportButton() {
  const [exported, setExported] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setExported(type);
    setTimeout(() => setExported(null), 2500);
  };

  return (
    <div className="flex items-center gap-2">
      {exported && (
        <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium animate-in fade-in slide-in-from-right-2">
          <CheckCircle2 className="h-4 w-4" />
          {exported} export initiated
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleExport("CSV")}>
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleExport("PDF")}>
            <FileText className="h-4 w-4 text-red-500" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleExport("Print")}>
            <Printer className="h-4 w-4 text-muted-foreground" />
            Print Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
