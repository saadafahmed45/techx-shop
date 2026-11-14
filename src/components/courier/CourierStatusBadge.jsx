"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  PackageCheck,
  PauseCircle,
  Loader2,
} from "lucide-react";

const COURIER_STATUS_CONFIG = {
  not_created: {
    label: "Not Booked",
    style: "bg-slate-100 text-slate-700 border-slate-200",
    icon: HelpCircle,
  },
  processing: {
    label: "Booking...",
    style: "bg-blue-100 text-blue-800 border-blue-200 animate-pulse",
    icon: Loader2,
  },
  in_review: {
    label: "In Review",
    style: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  pending: {
    label: "Pending Pickup",
    style: "bg-sky-100 text-sky-800 border-sky-200",
    icon: PackageCheck,
  },
  delivered: {
    label: "Delivered",
    style: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  partial_delivered: {
    label: "Partial Delivered",
    style: "bg-teal-100 text-teal-800 border-teal-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    style: "bg-rose-100 text-rose-800 border-rose-200",
    icon: XCircle,
  },
  hold: {
    label: "On Hold",
    style: "bg-orange-100 text-orange-800 border-orange-200",
    icon: PauseCircle,
  },
  return: {
    label: "Returned",
    style: "bg-red-100 text-red-800 border-red-200",
    icon: RotateCcw,
  },
  returned: {
    label: "Returned",
    style: "bg-red-100 text-red-800 border-red-200",
    icon: RotateCcw,
  },
  failed: {
    label: "Booking Failed",
    style: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
  unknown: {
    label: "Unknown / Verification Needed",
    style: "bg-purple-100 text-purple-800 border-purple-200",
    icon: AlertCircle,
  },
};

export default function CourierStatusBadge({ status, bookingState, className = "" }) {
  // Normalize key
  let key = "not_created";
  if (bookingState === "processing") key = "processing";
  else if (bookingState === "failed") key = "failed";
  else if (bookingState === "unknown") key = "unknown";
  else if (status) {
    const s = String(status).toLowerCase().trim().replace(/[\s\-]/g, "_");
    key = COURIER_STATUS_CONFIG[s] ? s : s;
  }

  const conf = COURIER_STATUS_CONFIG[key] || {
    label: status ? String(status).replace(/_/g, " ").toUpperCase() : "Unknown",
    style: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Truck,
  };

  const Icon = conf.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${conf.style} ${className}`}
    >
      <Icon className={`w-3 h-3 shrink-0 ${key === "processing" ? "animate-spin" : ""}`} />
      <span className="capitalize">{conf.label}</span>
    </span>
  );
}
