"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card as CardComponent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";

import { getErrorMessage } from "@/lib/api";
import {
  MoreVertical,
  Mail,
  Shield,
  CreditCard,
  Clock,
  LogIn,
  LogOut,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Card {
  card_id: string;
  status: "active" | "inactive";
  last_access: string;
  location: "inside" | "outside";
}

interface User {
  user_id: number;
  nama: string;
  email: string;
  role: string;
  cards: Card[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ nama: "", email: "" });
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    role: "student",
  });

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  const fetchUsers = async (t: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setUsers(res.data);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUsers(token);
  }, [token]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.nama.trim()) {
      errors.nama = "Full name is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addUser = async () => {
    if (!validateForm() || !token) return;

    try {
      setAdding(true);
      setError("");
      setSuccessMessage("");

      await axios.post("http://127.0.0.1:8000/api/users", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({ nama: "", email: "", role: "student" });
      setFormErrors({});
      setShowAdd(false);
      setSuccessMessage("User added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      await fetchUsers(token);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Failed to add user:", err);
    } finally {
      setAdding(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({ nama: user.nama, email: user.email });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editingUser || !token) return;

    try {
      setError("");
      await axios.put(
        `http://127.0.0.1:8000/api/users/${editingUser.user_id}`,
        { nama: editForm.nama, email: editForm.email },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowEditModal(false);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchUsers(token);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Failed to update user:", err);
    }
  };

  const toggleStatus = async (id: number) => {
    if (!token) return;

    try {
      setError("");
      await axios.post(
        `http://127.0.0.1:8000/api/users/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await fetchUsers(token);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Failed to toggle user status:", err);
    }
  };

  const deleteUser = async () => {
    if (!deleteTarget || !token) return;

    try {
      setError("");
      await axios.delete(
        `http://127.0.0.1:8000/api/users/${deleteTarget.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setDeleteTarget(null);

      await fetchUsers(token);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
    }
  };

  const toggleLocation = async (id: number) => {
    if (!token) return;

    try {
      setError("");
      await axios.post(
        `http://127.0.0.1:8000/api/users/${id}/toggle-location`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await fetchUsers(token);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Failed to toggle location:", err);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.cards[0]?.card_id?.toLowerCase().includes(search.toLowerCase()),
  );

  const highlight = (text: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-black rounded px-1">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const formatLastAccess = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-sm opacity-70 mt-1">
          Manage user accounts and permissions
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-900">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-900">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      <CardComponent>
        <div className="p-6 border-b">
          <div className="flex gap-3">
            <Input
              placeholder="Search by name, email, or card ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? "Cancel" : "Add User"}
            </Button>
          </div>
        </div>

        {showAdd && (
          <div className="p-6 border-b space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Full Name
              </label>
              <Input
                placeholder="Enter full name"
                value={form.nama}
                onChange={(e) => {
                  setForm({ ...form, nama: e.target.value });
                  if (formErrors.nama)
                    setFormErrors({ ...formErrors, nama: "" });
                }}
              />
              {formErrors.nama && (
                <p className="text-xs text-red-600 mt-1">{formErrors.nama}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (formErrors.email)
                    setFormErrors({ ...formErrors, email: "" });
                }}
              />
              {formErrors.email && (
                <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAdd(false);
                  setForm({ nama: "", email: "", role: "student" });
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
              <Button onClick={addUser} disabled={adding}>
                {adding ? "Adding..." : "Add User"}
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Name</span>
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Role</span>
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Card ID</span>
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Status</span>
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Location</span>
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Last Access</span>
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center opacity-50">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((u) => {
                  const card = u.cards[0];
                  return (
                    <tr
                      key={u.user_id}
                      className="border-b hover:bg-muted transition-colors"
                    >
                      <td className="px-6 py-3 text-sm font-medium">
                        {highlight(u.nama)}
                      </td>
                      <td className="px-6 py-3 text-sm opacity-70">
                        {highlight(u.email)}
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        <Badge variant="secondary" className="capitalize">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-sm font-mono">
                        {card?.card_id || "-"}
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        <Badge
                          variant={
                            card?.status === "active" ? "default" : "secondary"
                          }
                        >
                          {card?.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        <Badge variant="outline">
                          {card?.location === "inside" ? "Inside" : "Outside"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-sm opacity-70 text-xs">
                        {formatLastAccess(card?.last_access)}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => toggleStatus(u.user_id)}
                              className="cursor-pointer"
                            >
                              {card?.status === "active" ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  <span>Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleLocation(u.user_id)}
                              className="cursor-pointer"
                            >
                              {card?.location === "inside" ? (
                                <>
                                  <LogOut className="mr-2 h-4 w-4" />
                                  <span>Mark Outside</span>
                                </>
                              ) : (
                                <>
                                  <LogIn className="mr-2 h-4 w-4" />
                                  <span>Mark Inside</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditModal(u)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(u)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center opacity-50">
                    {search ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardComponent>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Full Name
                </label>
                <Input
                  value={editForm.nama}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nama: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="user@example.com"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.nama}
              </span>{" "}
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={deleteUser}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
