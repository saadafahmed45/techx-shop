"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
  ChevronDown,
  UserMinus,
  UserCheck,
  Calendar,
  Users as UsersIcon,
  UserX,
  KeyRound,
} from "lucide-react";
import Swal from "sweetalert2";
import { useCart } from "@/context/CartContext";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus,
} from "@/services/userService";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  if (status === "blocked") {
    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 w-fit">
        <AlertTriangle className="w-3 h-3" /> Blocked
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 w-fit">
      <CheckCircle2 className="w-3 h-3" /> Active
    </span>
  );
};

// ─── User Avatar with Fallback ────────────────────────────────────────────────
const UserAvatar = ({ src, name, className }) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div
        className={`${className} bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700`}
      >
        {name?.[0]?.toUpperCase() || "A"}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className={`${className} object-cover`}
      onError={() => setError(true)}
    />
  );
};

// ─── Main Admin Management Page ───────────────────────────────────────────────
export default function AdminManagementPage() {
  const { user: currentUser } = useCart();

  const [allAccounts, setAllAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [formPhoto, setFormPhoto] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers({ limit: 1000 });
      setAllAccounts(Array.isArray(data.data) ? data.data : []);
    } catch {
      Swal.fire({ icon: "error", title: "Failed to fetch administrator accounts" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter only Admins
  const adminUsers = useMemo(() => {
    return allAccounts.filter((u) => u.role === "admin");
  }, [allAccounts]);

  const customerCount = useMemo(() => {
    return allAccounts.filter((u) => u.role !== "admin").length;
  }, [allAccounts]);

  // Client Side Filtering & Search
  const filteredAdmins = useMemo(() => {
    const q = search.toLowerCase().trim();
    return adminUsers.filter((u) => {
      const matchSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [adminUsers, search, statusFilter]);

  // Open Modal Helpers
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedAdmin(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormStatus("active");
    setFormPhoto("");
    setModalOpen(true);
  };

  const openEditModal = (adminToEdit) => {
    setModalMode("edit");
    setSelectedAdmin(adminToEdit);
    setFormName(adminToEdit.name || "");
    setFormEmail(adminToEdit.email || "");
    setFormPassword("");
    setFormStatus(adminToEdit.status || "active");
    setFormPhoto(adminToEdit.photoURL || "");
    setModalOpen(true);
  };

  // Check if target admin is the current active logged-in user
  const isSelf = (admin) => {
    if (!currentUser) return false;
    return (
      (currentUser.uid && currentUser.uid === admin._id) ||
      (currentUser.email && currentUser.email.toLowerCase() === admin.email?.toLowerCase())
    );
  };

  // Submit Form Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (modalMode === "create") {
        await createUser({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: "admin",
          status: formStatus,
          photoURL: formPhoto,
        });
        Swal.fire({
          icon: "success",
          title: "Administrator created successfully",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await updateUser(selectedAdmin._id, {
          name: formName,
          email: formEmail,
          ...(formPassword ? { password: formPassword } : {}),
          role: "admin",
          status: formStatus,
          photoURL: formPhoto,
        });
        Swal.fire({
          icon: "success",
          title: "Administrator details updated",
          timer: 1400,
          showConfirmButton: false,
        });
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: modalMode === "create" ? "Creation Failed" : "Update Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Demote Admin to regular User
  const handleDemoteToUser = async (admin) => {
    if (isSelf(admin)) {
      Swal.fire({
        icon: "warning",
        title: "Action Blocked",
        text: "You cannot demote your own active admin account!",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Demote Administrator?",
      text: `Revoke administrative privileges from ${admin.name || admin.email}? This account will be transferred to User Management.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Yes, demote to Customer",
    });

    if (!result.isConfirmed) return;

    try {
      await updateUser(admin._id, { role: "user" });
      Swal.fire({
        icon: "success",
        title: "Demoted to Customer",
        text: `${admin.name || admin.email} is now a standard customer account and moved to User Management.`,
      });
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Demotion Failed",
        text: err.response?.data?.message || "Could not demote administrator",
      });
    }
  };

  // Toggle admin status (block/unblock)
  const handleStatusToggle = async (admin) => {
    if (isSelf(admin)) {
      Swal.fire({
        icon: "warning",
        title: "Action Blocked",
        text: "You cannot block your own active admin account!",
      });
      return;
    }

    const nextStatus = admin.status === "active" ? "blocked" : "active";
    const actionText = nextStatus === "blocked" ? "Block" : "Unblock";

    const result = await Swal.fire({
      title: `${actionText} administrator?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} access for this administrator?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "blocked" ? "#ef4444" : "#10b981",
      confirmButtonText: actionText,
    });

    if (!result.isConfirmed) return;

    try {
      await changeUserStatus(admin._id, nextStatus);
      Swal.fire({
        icon: "success",
        title: `Status changed to ${nextStatus}`,
        timer: 1400,
        showConfirmButton: false,
      });
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Status Change Failed",
        text: err.response?.data?.message,
      });
    }
  };

  // Delete admin handler
  const handleDelete = async (admin) => {
    if (isSelf(admin)) {
      Swal.fire({
        icon: "error",
        title: "Action Blocked",
        text: "You cannot delete your own active administrator account!",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Delete Administrator?",
      text: "This action cannot be undone. The administrator account will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Admin",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(admin._id);
      Swal.fire({
        icon: "success",
        title: "Deleted successfully",
        timer: 1400,
        showConfirmButton: false,
      });
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.response?.data?.message,
      });
    }
  };

  // Stats Calculations for Admins
  const statsTotal = adminUsers.length;
  const statsActive = adminUsers.filter((u) => u.status === "active").length;
  const statsBlocked = adminUsers.filter((u) => u.status === "blocked").length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Loading Administrator database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ─── SECTION SWITCHER TABS ─── */}
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl w-fit shadow-xs">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-50 text-xs font-bold transition"
          >
            <UsersIcon className="w-4 h-4" />
            <span>User Management</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
              {customerCount}
            </span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Management</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
              {adminUsers.length}
            </span>
          </div>
        </div>

        {/* ─── HEADER ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Admin Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage system administrators, staff privileges, and privileged store access
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-600 transition cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={openCreateModal}
              className="h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Administrator</span>
            </button>
          </div>
        </div>

        {/* ─── STATS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                Total Admins
              </h3>
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="mt-2 text-3xl font-black text-slate-900">{statsTotal}</p>
          </div>

          <div className="bg-emerald-50/70 rounded-3xl border border-emerald-100 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-emerald-600 text-xs uppercase tracking-widest font-bold">
                Active Staff
              </h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-3xl font-black text-emerald-800">{statsActive}</p>
          </div>

          <div className="bg-rose-50/70 rounded-3xl border border-rose-100 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-rose-600 text-xs uppercase tracking-widest font-bold">
                Blocked / Inactive
              </h3>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <p className="mt-2 text-3xl font-black text-rose-800">{statsBlocked}</p>
          </div>
        </div>

        {/* ─── FILTERS ─── */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3 shadow-xs">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search administrators by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="relative min-w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full h-11 pl-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ─── TABLE CONTAINER ─── */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-widest text-slate-400 font-bold">
            <div className="col-span-5">Administrator</div>
            <div className="col-span-2">Privilege Level</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredAdmins.map((admin) => {
              const currentSession = isSelf(admin);

              return (
                <div
                  key={admin._id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50/80 transition items-center"
                >
                  {/* Administrator Profile */}
                  <div className="col-span-5 flex items-center gap-3.5">
                    <UserAvatar
                      src={admin.photoURL}
                      name={admin.name}
                      className="w-11 h-11 rounded-2xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-2">
                        <span>{admin.name || "Unnamed Administrator"}</span>
                        {currentSession && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{admin.email}</div>
                    </div>
                  </div>

                  {/* Privilege Level */}
                  <div className="col-span-2 flex items-center">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 w-fit">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Full Access</span>
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <StatusBadge status={admin.status} />
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-start lg:justify-end gap-2 flex-wrap">
                    {/* Demote to Customer */}
                    <button
                      onClick={() => handleDemoteToUser(admin)}
                      disabled={currentSession}
                      title={
                        currentSession
                          ? "You cannot demote yourself"
                          : "Demote to standard Customer"
                      }
                      className="h-8 px-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Demote</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(admin)}
                      title="Edit Administrator"
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:border-indigo-300 hover:text-indigo-600 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Block / Unblock */}
                    <button
                      onClick={() => handleStatusToggle(admin)}
                      disabled={currentSession}
                      title={
                        currentSession
                          ? "You cannot block yourself"
                          : admin.status === "active"
                          ? "Block Administrator"
                          : "Unblock Administrator"
                      }
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        admin.status === "active"
                          ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {admin.status === "active" ? (
                        <UserMinus className="w-3.5 h-3.5" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(admin)}
                      disabled={currentSession}
                      title={
                        currentSession
                          ? "You cannot delete yourself"
                          : "Delete Administrator"
                      }
                      className="w-8 h-8 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredAdmins.length === 0 && (
              <div className="py-20 text-center px-4">
                <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No Administrators Found</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "Administrator accounts will appear here."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ─── MODAL (CREATE / EDIT ADMINISTRATOR) ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900">
                  {modalMode === "create" ? "Add New Administrator" : "Edit Administrator Details"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900">
                <KeyRound className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Administrators have full management privileges over products, orders, settings, and user accounts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@techxshop.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {modalMode === "create" ? "Password" : "New Password (Leave blank to keep unchanged)"}
                </label>
                <input
                  type="password"
                  required={modalMode === "create"}
                  placeholder={modalMode === "create" ? "At least 6 characters" : "••••••••"}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Avatar / Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Account Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="active">Active (Full admin dashboard access)</option>
                  <option value="blocked">Blocked (Restricted from logging in)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-11 px-5 rounded-2xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 transition cursor-pointer disabled:opacity-50"
                >
                  {submitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{modalMode === "create" ? "Create Administrator" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
