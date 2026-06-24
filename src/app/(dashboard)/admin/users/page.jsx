"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search, Edit2, Trash2, Plus, RefreshCw,
  CheckCircle2, AlertTriangle, Loader2, User,
  Shield, ShieldAlert, X, ChevronDown, UserMinus, UserCheck, Calendar
} from "lucide-react";
import Swal from "sweetalert2";
import { useCart } from "@/context/CartContext";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus
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

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  if (role === "admin") {
    return (
      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 w-fit">
        <ShieldAlert className="w-3 h-3" /> Admin
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1 w-fit">
      <User className="w-3 h-3" /> User
    </span>
  );
};

// ─── User Avatar with Fallback ────────────────────────────────────────────────
const UserAvatar = ({ src, name, className }) => {
  const [error, setError] = useState(false);
  useEffect(() => { setError(false); }, [src]);

  if (!src || error) {
    return (
      <div className={`${className} bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600`}>
        {name?.[0]?.toUpperCase() || "U"}
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

// ─── Main Manage Users Page ──────────────────────────────────────────────────
export default function ManageUsers() {
  const { user: currentUser } = useCart(); // Active logged in admin

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("user");
  const [formStatus, setFormStatus] = useState("active");
  const [formPhoto, setFormPhoto] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers({ limit: 1000 }); // fetch up to 1000 users for panel search/filter
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch {
      Swal.fire({ icon: "error", title: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Client Side Filtering & Search
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Open Modal Helpers
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("user");
    setFormStatus("active");
    setFormPhoto("");
    setModalOpen(true);
  };

  const openEditModal = (userToEdit) => {
    setModalMode("edit");
    setSelectedUser(userToEdit);
    setFormName(userToEdit.name || "");
    setFormEmail(userToEdit.email || "");
    setFormPassword(""); // Don't prepopulate passwords
    setFormRole(userToEdit.role || "user");
    setFormStatus(userToEdit.status || "active");
    setFormPhoto(userToEdit.photoURL || "");
    setModalOpen(true);
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
          role: formRole,
          status: formStatus,
          photoURL: formPhoto
        });
        Swal.fire({ icon: "success", title: "User created", timer: 1400, showConfirmButton: false });
      } else {
        await updateUser(selectedUser._id, {
          name: formName,
          email: formEmail,
          role: formRole,
          status: formStatus,
          photoURL: formPhoto
        });
        Swal.fire({ icon: "success", title: "User details updated", timer: 1400, showConfirmButton: false });
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: modalMode === "create" ? "Creation Failed" : "Update Failed",
        text: err.response?.data?.message || "Something went wrong"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Toggle user status (block/unblock)
  const handleStatusToggle = async (userId, currentStatus) => {
    const isSelf = currentUser?.uid === userId;
    if (isSelf) {
      Swal.fire({ icon: "warning", title: "Action Blocked", text: "You cannot block yourself!" });
      return;
    }

    const nextStatus = currentStatus === "active" ? "blocked" : "active";
    const actionText = nextStatus === "blocked" ? "Block" : "Unblock";

    const result = await Swal.fire({
      title: `${actionText} user?`,
      text: `Are you sure you want to change user status to ${nextStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "blocked" ? "#ef4444" : "#10b981",
      confirmButtonText: actionText
    });

    if (!result.isConfirmed) return;

    try {
      await changeUserStatus(userId, nextStatus);
      Swal.fire({ icon: "success", title: `User status changed to ${nextStatus}`, timer: 1400, showConfirmButton: false });
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Status Change Failed", text: err.response?.data?.message });
    }
  };

  // Delete user handler
  const handleDelete = async (userId) => {
    const isSelf = currentUser?.uid === userId;
    if (isSelf) {
      Swal.fire({ icon: "error", title: "Action Blocked", text: "You cannot delete your own admin account!" });
      return;
    }

    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone. User account will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(userId);
      Swal.fire({ icon: "success", title: "Deleted successfully", timer: 1400, showConfirmButton: false });
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Delete Failed", text: err.response?.data?.message });
    }
  };

  // Stats Calculations
  const statsTotal = users.length;
  const statsActive = users.filter((u) => u.status === "active").length;
  const statsBlocked = users.filter((u) => u.status === "blocked").length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm text-slate-400">Loading Users database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 font-sans">User Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              {filteredUsers.length} of {users.length} users registered
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              className="h-11 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-medium flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-600 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={openCreateModal}
              className="h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold">Total Accounts</h3>
            <p className="mt-2 text-3xl font-black text-slate-900">{statsTotal}</p>
          </div>
          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-5 shadow-sm">
            <h3 className="text-emerald-500 text-xs uppercase tracking-widest font-bold">Active Users</h3>
            <p className="mt-2 text-3xl font-black text-emerald-700">{statsActive}</p>
          </div>
          <div className="bg-red-50 rounded-3xl border border-red-100 p-5 shadow-sm">
            <h3 className="text-red-500 text-xs uppercase tracking-widest font-bold">Blocked</h3>
            <p className="mt-2 text-3xl font-black text-red-700">{statsBlocked}</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            />
          </div>
          
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none h-11 pl-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none h-11 pl-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-widest text-slate-400 font-bold">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Profile Info</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1.5">Role</div>
            <div className="col-span-1.5">Status</div>
            <div className="col-span-2">Registered</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <UserMinus className="w-12 h-12" />
              <p className="mt-4 font-semibold">No Users Found</p>
            </div>
          ) : (
            filteredUsers.map((userObj, index) => {
              const isSelf = currentUser?.uid === userObj._id;
              const formattedDate = userObj.createdAt
                ? new Date(userObj.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                : "N/A";

              return (
                <div
                  key={userObj._id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 border-b border-slate-100 hover:bg-slate-50 transition items-center"
                >
                  {/* index */}
                  <div className="lg:col-span-1 flex items-center text-sm text-slate-400 font-semibold">
                    {index + 1}
                  </div>

                  {/* profile info */}
                  <div className="lg:col-span-3 flex items-center gap-4">
                    <UserAvatar
                      src={userObj.photoURL || userObj.photo}
                      name={userObj.name}
                      className="w-12 h-12 rounded-full border border-slate-200 shrink-0 object-cover"
                    />
                    <div className="min-w-0">
                      <h2 className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                        {userObj.name}
                        {isSelf && (
                          <span className="text-[10px] bg-slate-150 text-slate-500 font-normal px-2 py-0.5 rounded-full border border-slate-200">
                            You
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 truncate font-mono">ID: {userObj._id}</p>
                    </div>
                  </div>

                  {/* email */}
                  <div className="lg:col-span-3 flex items-center text-sm text-slate-600 font-medium truncate">
                    {userObj.email}
                  </div>

                  {/* role */}
                  <div className="lg:col-span-1.5 flex items-center">
                    <RoleBadge role={userObj.role} />
                  </div>

                  {/* status */}
                  <div className="lg:col-span-1.5 flex items-center">
                    <StatusBadge status={userObj.status} />
                  </div>

                  {/* registered */}
                  <div className="lg:col-span-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>

                  {/* actions */}
                  <div className="lg:col-span-2 flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(userObj)}
                      title="Edit User"
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:border-indigo-200 hover:text-indigo-600 transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleStatusToggle(userObj._id, userObj.status)}
                      disabled={isSelf}
                      title={userObj.status === "active" ? "Block User" : "Activate User"}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                        ${userObj.status === "active"
                          ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                          : "border-emerald-100 bg-emerald-50 text-emerald-500 hover:bg-emerald-100"}`}
                    >
                      {userObj.status === "active" ? (
                        <UserMinus className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(userObj._id)}
                      disabled={isSelf}
                      title="Delete User"
                      className="w-9 h-9 rounded-xl border border-red-100 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ─── MODAL DIALOG ──────────────────────────────────────────────────── */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">
                  {modalMode === "create" ? "Add New User" : "Edit User Profile"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Password (Only required for create mode) */}
                {modalMode === "create" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="•••••••• (Min 6 chars)"
                      className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    />
                  </div>
                )}

                {/* Avatar Photo URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={formPhoto}
                    onChange={(e) => setFormPhoto(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full h-11 px-4 text-sm rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Roles and Status Select fields */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Role */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Account Role
                    </label>
                    <div className="relative">
                      <select
                        value={formRole}
                        disabled={modalMode === "edit" && selectedUser?._id === currentUser?.uid}
                        onChange={(e) => setFormRole(e.target.value)}
                        className="appearance-none w-full h-11 pl-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition cursor-pointer disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Account Status
                    </label>
                    <div className="relative">
                      <select
                        value={formStatus}
                        disabled={modalMode === "edit" && selectedUser?._id === currentUser?.uid}
                        onChange={(e) => setFormStatus(e.target.value)}
                        className="appearance-none w-full h-11 pl-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition cursor-pointer disabled:opacity-50"
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
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
                    className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-100 transition cursor-pointer disabled:opacity-60"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
