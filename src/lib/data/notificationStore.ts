export interface Notification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  module: "Asset" | "Allocation" | "Maintenance" | "Booking";
  referenceId?: string;
  read: boolean;
  priority: "Low" | "Medium" | "High" | "Critical";
}

export const initialNotifications: Notification[] = [
  {
    id: "NTF-0001",
    timestamp: "2026-06-02T09:00:00Z",
    title: "Overdue Maintenance Request",
    message: "Maintenance request mr-3 (Color Calibration & Clean) for Dell 27\" UltraSharp Monitor is now OVERDUE.",
    module: "Maintenance",
    referenceId: "mr-3",
    read: false,
    priority: "Medium"
  },
  {
    id: "NTF-0002",
    timestamp: "2026-07-12T11:00:00Z",
    title: "New Booking Request",
    message: "A new booking request BK-0004 has been submitted by Sana Iqbal for MacBook Pro 16\".",
    module: "Booking",
    referenceId: "BK-0004",
    read: false,
    priority: "Low"
  },
  {
    id: "NTF-0003",
    timestamp: "2026-07-01T09:05:00Z",
    title: "Maintenance In Progress",
    message: "Maintenance service started for Delivery Van (Engine Diagnostics & Oil Change).",
    module: "Maintenance",
    referenceId: "mr-1",
    read: true,
    priority: "High"
  },
  {
    id: "NTF-0004",
    timestamp: "2026-07-12T08:05:00Z",
    title: "Asset Checked Out",
    message: "Delivery Van (AF-0003) checked out by Rohan Mehta for purpose: Warehouse transfer.",
    module: "Booking",
    referenceId: "BK-0002",
    read: true,
    priority: "High"
  }
];

export function getStoredNotifications(): Notification[] {
  if (typeof window === "undefined") return initialNotifications;
  try {
    const stored = localStorage.getItem("assetflow_notifications");
    if (stored) {
      return JSON.parse(stored);
    } else {
      localStorage.setItem("assetflow_notifications", JSON.stringify(initialNotifications));
      return initialNotifications;
    }
  } catch (error) {
    console.error("Error reading notifications from localStorage:", error);
    return initialNotifications;
  }
}

export function saveNotifications(notifications: Notification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("assetflow_notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("Error saving notifications to localStorage:", error);
  }
}

export function addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
  const notifications = getStoredNotifications();
  const nextNum = notifications.length + 1;
  const newNotification: Notification = {
    ...notification,
    id: `NTF-${String(nextNum).padStart(4, "0")}`,
    timestamp: new Date().toISOString(),
    read: false
  };
  notifications.unshift(newNotification); // New notifications at top
  saveNotifications(notifications);
  return newNotification;
}

export function markAsRead(id: string) {
  const notifications = getStoredNotifications();
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
}

export function markAsUnread(id: string) {
  const notifications = getStoredNotifications();
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: false } : n));
  saveNotifications(updated);
}

export function markAllAsRead() {
  const notifications = getStoredNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
}

export function deleteNotification(id: string) {
  const notifications = getStoredNotifications();
  const updated = notifications.filter((n) => n.id !== id);
  saveNotifications(updated);
}

export function clearNotifications() {
  if (typeof window === "undefined") return;
  localStorage.setItem("assetflow_notifications", JSON.stringify([]));
}
