"use client";

import { useState, useEffect } from "react";
import {
  getStoredNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  Notification
} from "@/lib/data/notificationStore";
import { NotificationsList } from "./notifications-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, CheckSquare, Trash2, ShieldAlert, Archive, Activity } from "lucide-react";

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>(() => getStoredNotifications());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [isClearOpen, setIsClearOpen] = useState(false);

  // Load notifications from storage
  useEffect(() => {
    // Listen to changes to storage
    const handleStorageChange = () => {
      setNotifications(getStoredNotifications());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const refreshData = () => {
    setNotifications(getStoredNotifications());
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    refreshData();
  };

  const handleMarkAsUnread = (id: string) => {
    markAsUnread(id);
    refreshData();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    refreshData();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    refreshData();
  };

  const handleClearAll = () => {
    clearNotifications();
    setNotifications([]);
    setIsClearOpen(false);
  };

  // Filter notifications logic
  const filteredNotifications = notifications.filter((n) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchMsg = n.message.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg) return false;
    }

    // 2. Module Filter
    if (selectedModule !== "all" && n.module !== selectedModule) {
      return false;
    }

    // 3. Priority Filter
    if (selectedPriority !== "all" && n.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const unreadList = filteredNotifications.filter((n) => !n.read);
  const readList = filteredNotifications.filter((n) => n.read);

  // Compute KPIs
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalUnreadCount = notifications.filter(
    (n) => !n.read && (n.priority === "Critical" || n.priority === "High")
  ).length;
  const totalCount = notifications.length;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notification Center</h2>
          <p className="text-muted-foreground text-sm">
            Receive automated real-time status alerts for asset allocations, overdue maintenance, and booking requests.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 text-xs h-9"
          >
            <CheckSquare className="h-4 w-4" />
            Mark All as Read
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsClearOpen(true)}
            disabled={totalCount === 0}
            className="flex items-center gap-2 text-xs h-9"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Unread Alerts</CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Active updates requiring attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Critical & High Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalUnreadCount}</div>
            <p className="text-xs text-muted-foreground">Urgent unread security/maintenance notices</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Total Logged Notifications</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Inbox historical message volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters panel */}
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedModule} onValueChange={(val) => { if (val) setSelectedModule(val); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Allocation">Allocation</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Booking">Booking</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={(val) => { if (val) setSelectedPriority(val); }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabs list (Unread vs Archive) */}
      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread" className="relative pr-6">
            Active Inbox
            {unreadList.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                {unreadList.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="archive" className="flex items-center gap-1.5">
            <Archive className="h-3.5 w-3.5" />
            Archive / Read ({readList.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="unread" className="space-y-4 outline-none">
          <NotificationsList
            notifications={unreadList}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onDelete={handleDelete}
          />
        </TabsContent>
        
        <TabsContent value="archive" className="space-y-4 outline-none">
          <NotificationsList
            notifications={readList}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {/* Clear Notifications Dialog */}
      <Dialog open={isClearOpen} onOpenChange={setIsClearOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" />
              Confirm Clear All Notifications
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete all notifications? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
