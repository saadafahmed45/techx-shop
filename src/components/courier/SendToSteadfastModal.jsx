"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Truck,
  User,
  Phone,
  MapPin,
  DollarSign,
  AlertCircle,
  Package,
  Loader2,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";
import { useBookSteadfastOrder } from "@/lib/admin-hooks";

const cleanBdPhone = (rawPhone) => {
  if (!rawPhone) return "";
  let cleaned = String(rawPhone).replace(/[\s\-\(\)\.]/g, "");
  if (cleaned.startsWith("+880")) cleaned = cleaned.slice(3);
  else if (cleaned.startsWith("880")) cleaned = cleaned.slice(2);
  return cleaned;
};

export default function SendToSteadfastModal({ order, isOpen, onClose, onSuccess }) {
  const bookOrder = useBookSteadfastOrder();

  const [recipientName, setRecipientName] = useState(
    order?.customerName || order?.name || order?.courier?.recipientName || ""
  );
  const [recipientPhone, setRecipientPhone] = useState(
    cleanBdPhone(order?.phone || order?.courier?.recipientPhone || "")
  );
  const [recipientAddress, setRecipientAddress] = useState(
    order?.address || order?.courier?.recipientAddress || ""
  );
  const [deliveryCharge, setDeliveryCharge] = useState(
    order?.deliveryCharge || order?.courier?.deliveryCharge || 0
  );
  const [alreadyPaid, setAlreadyPaid] = useState(
    order?.alreadyPaid || order?.courier?.alreadyPaid || 0
  );
  const [note, setNote] = useState(order?.note || order?.courier?.note || "");
  const [customCod, setCustomCod] = useState("");
  const [useCustomCod, setUseCustomCod] = useState(false);

  // Sync state whenever order prop changes
  useEffect(() => {
    if (order) {
      setRecipientName(
        order.customerName || order.name || order.courier?.recipientName || ""
      );
      setRecipientPhone(
        cleanBdPhone(order.phone || order.courier?.recipientPhone || "")
      );
      setRecipientAddress(
        order.address || order.courier?.recipientAddress || ""
      );
      setDeliveryCharge(
        order.deliveryCharge || order.courier?.deliveryCharge || 0
      );
      setAlreadyPaid(
        order.alreadyPaid || order.courier?.alreadyPaid || 0
      );
      setNote(order.note || order.courier?.note || "");
      setCustomCod("");
      setUseCustomCod(false);
    }
  }, [order]);

  // Derived financial calculation
  const calculatedCod = useMemo(() => {
    const total = Number(order?.totalPrice) || 0;
    const deliv = Number(deliveryCharge) || 0;
    const paid = Number(alreadyPaid) || 0;
    return Math.max(0, Math.round(total + deliv - paid));
  }, [order?.totalPrice, deliveryCharge, alreadyPaid]);

  const finalCodAmount = useCustomCod ? Number(customCod) || 0 : calculatedCod;

  // Phone validation check
  const isPhoneValid = useMemo(() => {
    if (!recipientPhone) return false;
    const cleaned = String(recipientPhone).replace(/[\s\-\(\)\.]/g, "");
    const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return bdRegex.test(cleaned);
  }, [recipientPhone]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipientName.trim()) {
      toast.error("Please provide a recipient name");
      return;
    }

    if (!isPhoneValid) {
      toast.error("Please enter a valid 11-digit Bangladesh phone number (e.g. 017XXXXXXXX)");
      return;
    }

    if (!recipientAddress.trim() || recipientAddress.trim().length < 5) {
      toast.error("Recipient address must contain street/area details (at least 5 characters)");
      return;
    }

    try {
      const cleanedPhone = cleanBdPhone(recipientPhone.trim());
      const payload = {
        recipientName: recipientName.trim(),
        recipientPhone: cleanedPhone,
        recipientAddress: recipientAddress.trim(),
        deliveryCharge: Number(deliveryCharge) || 0,
        alreadyPaid: Number(alreadyPaid) || 0,
        codAmount: finalCodAmount,
        note: note.trim(),
      };

      const res = await bookOrder.mutateAsync({
        id: order._id,
        payload,
      });

      toast.success(
        `Parcel created! Consignment ID: ${res?.data?.consignmentId || "N/A"}`
      );

      if (onSuccess) onSuccess(res?.data);
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to book parcel with Steadfast Courier");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                Send to Steadfast Courier
              </h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                Order #{order._id?.slice(-8).toUpperCase()} • Manual Booking Confirmation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={bookOrder.isPending}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Products Summary Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Items in Parcel ({order.products?.length || 0})
              </span>
              <span>Subtotal: ${order.totalPrice?.toLocaleString()}</span>
            </div>
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {order.products?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-100"
                >
                  <span className="truncate max-w-[75%] font-medium">
                    {item.title} <span className="text-slate-400">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-slate-900">
                    ${(item.price * item.quantity)?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Information Fields */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recipient & Delivery Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Phone (11 digits) *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    onBlur={() => setRecipientPhone((p) => cleanBdPhone(p))}
                    placeholder="01XXXXXXXXX"
                    className={`w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border text-xs font-medium outline-none transition ${
                      recipientPhone && !isPhoneValid
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-100"
                        : "border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                </div>
                {recipientPhone && !isPhoneValid && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Must be 11 digits starting with 01
                    {cleanBdPhone(recipientPhone).length > 0 && cleanBdPhone(recipientPhone).length !== 11
                      ? ` (${cleanBdPhone(recipientPhone).length} digits)`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <textarea
                  required
                  rows={2}
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none"
                  placeholder="House, Road, Area, District, Division"
                />
              </div>
            </div>
          </div>

          {/* Financial Breakdown & COD Calculation */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Cash On Delivery (COD) Breakdown
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Products Total</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  ${order.totalPrice?.toLocaleString() || 0}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Fee</span>
                <input
                  type="number"
                  min="0"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="w-full font-bold text-slate-900 text-sm mt-0.5 border-b border-dashed border-indigo-300 outline-none bg-transparent"
                  placeholder="0"
                />
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Already Paid</span>
                <input
                  type="number"
                  min="0"
                  value={alreadyPaid}
                  onChange={(e) => setAlreadyPaid(e.target.value)}
                  className="w-full font-bold text-emerald-600 text-sm mt-0.5 border-b border-dashed border-indigo-300 outline-none bg-transparent"
                  placeholder="0"
                />
              </div>

              <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-xs">
                <span className="text-indigo-200 block text-[10px] uppercase font-bold">COD to Collect</span>
                <span className="font-black text-white text-base mt-0.5 block">
                  ৳{finalCodAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={useCustomCod}
                  onChange={(e) => {
                    setUseCustomCod(e.target.checked);
                    if (e.target.checked && !customCod) setCustomCod(calculatedCod.toString());
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Override COD Amount Manually
              </label>

              {useCustomCod && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-indigo-900">Custom COD:</span>
                  <input
                    type="number"
                    min="0"
                    value={customCod}
                    onChange={(e) => setCustomCod(e.target.value)}
                    className="w-24 h-7 px-2 rounded-lg bg-white border border-indigo-300 text-xs font-bold text-indigo-900 outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Delivery Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Courier Delivery Note (Optional)
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Call before delivery, handle with care"
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={bookOrder.isPending}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={bookOrder.isPending || !isPhoneValid}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookOrder.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending to Steadfast...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Confirm & Send to Steadfast</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
