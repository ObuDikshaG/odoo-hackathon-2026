import { getStoredAssets } from "./assetStore";
import { addAuditEntry } from "./auditStore";
import { addNotification } from "./notificationStore";

export interface LogEventParams {
  module: "Asset" | "Allocation" | "Maintenance" | "Booking" | "Organization";
  action: string;
  assetId: string | null;
  performedById: string;
  performedByName: string;
  description: string;
  details?: unknown;
  createNotification?: boolean;
  notificationTitle?: string;
  notificationPriority?: "Low" | "Medium" | "High" | "Critical";
  referenceId?: string;
}

export function logEvent({
  module,
  action,
  assetId,
  performedById,
  performedByName,
  description,
  details,
  createNotification = false,
  notificationTitle,
  notificationPriority = "Low",
  referenceId
}: LogEventParams) {
  // Look up asset name and tag if assetId is provided
  let assetName: string | null = null;
  let assetTag: string | null = null;

  if (assetId) {
    try {
      const assets = getStoredAssets();
      const asset = assets.find((a) => a.id === assetId);
      if (asset) {
        assetName = asset.name;
        assetTag = asset.tag;
      }
    } catch {
      console.error("Error looking up asset in event logger:");
    }
  }

  // Stringify details if it is an object
  let formattedDetails = "";
  if (details) {
    if (typeof details === "string") {
      formattedDetails = details;
    } else {
      try {
        formattedDetails = JSON.stringify(details);
      } catch {
        formattedDetails = String(details);
      }
    }
  }

  // 1. Add Audit Entry
  const auditEntry = addAuditEntry({
    module,
    action,
    assetId,
    assetName,
    assetTag,
    performedById,
    performedByName,
    description,
    details: formattedDetails || undefined
  });

  // 2. Conditionally Add Notification
  if (createNotification && module !== "Organization") {
    addNotification({
      title: notificationTitle || `${module} Action: ${action}`,
      message: description,
      module: module as "Asset" | "Allocation" | "Maintenance" | "Booking",
      priority: notificationPriority,
      referenceId: referenceId || undefined
    });
  }

  return auditEntry;
}
