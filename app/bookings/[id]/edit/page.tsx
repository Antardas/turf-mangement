"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ArrowLeft, DollarSign } from "lucide-react";
import Link from "next/link";
import { TurfField, User } from "@/types";
import { format } from "date-fns";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<TurfField[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedField, setSelectedField] = useState<TurfField | null>(null);

  const [formData, setFormData] = useState({
    field_id: "",
    user_id: "",
    start_time: "",
    end_time: "",
    status: "pending",
    total_amount: 0,
    notes: "",
  });

  useEffect(() => {
    fetchFields();
    fetchUsers();
    fetchBooking();
  }, [id]);

  useEffect(() => {
    if (formData.field_id && formData.start_time && formData.end_time) {
      const field = fields.find((f) => f.id === formData.field_id);
      if (field) {
        const start = new Date(formData.start_time);
        const end = new Date(formData.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (hours > 0) {
          setFormData((prev) => ({ ...prev, total_amount: hours * field.price_per_hour }));
        }
      }
    }
  }, [formData.field_id, formData.start_time, formData.end_time, fields]);

  const fetchFields = async () => {
    const { data } = await supabase.from("turf_fields").select("*").order("name");
    if (data) setFields(data);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*").order("name");
    if (data) setUsers(data);
  };

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          field_id: data.field_id,
          user_id: data.user_id,
          start_time: format(new Date(data.start_time), "yyyy-MM-dd'T'HH:mm"),
          end_time: format(new Date(data.end_time), "yyyy-MM-dd'T'HH:mm"),
          status: data.status,
          total_amount: data.total_amount,
          notes: data.notes || "",
        });
        const field = await supabase.from("turf_fields").select("*").eq("id", data.field_id).single();
        if (field.data) setSelectedField(field.data);
      }
    } catch (err) {
      setError("Failed to load booking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          field_id: formData.field_id,
          user_id: formData.user_id,
          start_time: formData.start_time,
          end_time: formData.end_time,
          status: formData.status,
          total_amount: formData.total_amount,
          notes: formData.notes,
        })
        .eq("id", id);
      if (error) throw error;
      router.push("/bookings");
    } catch (err) {
      setError("Failed to update booking");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/bookings"
            className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Booking</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Update booking details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <FormSelect
            label="Field"
            value={formData.field_id}
            onChange={(e) => {
              setFormData({ ...formData, field_id: e.target.value });
              const field = fields.find((f) => f.id === e.target.value);
              setSelectedField(field || null);
            }}
            options={[{ value: "", label: "Select a field" }, ...fields.map((f) => ({ value: f.id, label: `${f.name} ($${f.price_per_hour}/hr)` }))]}
            required
          />

          <FormSelect
            label="User"
            value={formData.user_id}
            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
            options={[{ value: "", label: "Select a user" }, ...users.map((u) => ({ value: u.id, label: u.name || u.email }))]}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Time</label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">End Time</label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                required
              />
            </div>
          </div>

          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={statusOptions}
            required
          />

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-zinc-900 dark:text-white">Total Amount: ${formData.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <FormTextarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex gap-2 pt-4">
            <Link
              href="/bookings"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
