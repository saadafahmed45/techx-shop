"use client";

import React from "react";
import { Wallet, RefreshCw, AlertCircle } from "lucide-react";
import { useSteadfastBalance } from "@/lib/admin-hooks";

export default function CourierBalanceWidget({ className = "" }) {
  const { data, isLoading, isFetching, refetch, error } = useSteadfastBalance();

  const balance = data?.currentBalance ?? 0;

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            Steadfast Balance
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            {isLoading ? (
              <span className="text-xl font-bold text-slate-400 animate-pulse">
                Loading...
              </span>
            ) : error ? (
              <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Unavailable
              </span>
            ) : (
              <span className="text-2xl font-black text-slate-900">
                ৳{balance.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => refetch()}
        disabled={isFetching}
        title="Check Balance"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Check Balance</span>
      </button>
    </div>
  );
}
