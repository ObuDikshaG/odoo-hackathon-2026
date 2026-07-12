"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notification } from "@/lib/data/notificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, Undo2, Trash2, ArrowUpRight, Wrench, Calendar, Package, HardDrive } from "lucide-react";
import Link from "next/link";

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationsList({
  notifications,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete
}: NotificationsListProps) {
  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case "Critical":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold text-[10px]">Critical</Badge>;
      case "High":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px]">High</Badge>;
      case "Medium":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[10px]">Medium</Badge>;
      default:
        return <Badge variant="secondary" className="font-semibold text-[10px]">Low</Badge>;
    }
  };

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case "Asset":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "Allocation":
        return <HardDrive className="h-5 w-5 text-purple-500" />;
      case "Maintenance":
        return <Wrench className="h-5 w-5 text-amber-500" />;
      case "Booking":
        return <Calendar className="h-5 w-5 text-emerald-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getModuleHref = (mod: string) => {
    switch (mod) {
      case "Asset":
        return "/assets";
      case "Allocation":
        return "/allocation";
      case "Maintenance":
        return "/maintenance";
      case "Booking":
        return "/booking";
      default:
        return "/";
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = new Date().getTime() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">All caught up!</h3>
            <p className="text-muted-foreground text-sm max-w-sm mt-1">
              No notifications found in this tab. Great job keeping up with updates!
            </p>
          </CardContent>
        </Card>
      ) : (
        notifications.map((n) => (
          <Card
            key={n.id}
            className={`shadow-sm transition-all border-l-4 hover:border-l-primary/60 ${
              n.read ? "bg-card border-l-muted" : "bg-primary/5 border-l-primary"
            }`}
          >
            <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-lg bg-background p-2.5 border shadow-sm shrink-0">
                  {getModuleIcon(n.module)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-semibold ${n.read ? "text-foreground" : "text-primary"}`}>
                      {n.title}
                    </h4>
                    {getPriorityBadge(n.priority)}
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {formatRelativeTime(n.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-0 border-muted">
                {/* Redirect reference link */}
                <Link href={getModuleHref(n.module)}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-primary font-medium hover:bg-primary/10">
                    Go to {n.module}
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </Link>

                {/* Read/Unread state toggle */}
                {n.read ? (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => onMarkAsUnread(n.id)}
                    title="Mark as Unread"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/10"
                    onClick={() => onMarkAsRead(n.id)}
                    title="Mark as Read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}

                {/* Delete button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => onDelete(n.id)}
                  title="Delete Alert"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
