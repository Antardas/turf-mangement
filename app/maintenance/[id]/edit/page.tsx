"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TurfField, User } from "@/types";
import { format } from "date-fns";

const taskTypeOptions = [
  { value: "watering", label: "Watering" },
  { value: "mowing", label: "Mowing" },
  { value: "fertilizing", label: "Fertilizing" },
  { value: "aerating", label: "Aerating" },
  { value: "pest_control", label: "Pest Control" },
  { value: "general_inspection", label: "General Inspection" },
];

const statusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function EditMaintenancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<TurfField[]>([]);
  const [staff, setStaff] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    field_id: "",
    staff_id: "",
    task_type: "general_inspection",
    scheduled_date: "",
    completed_date: "",
    status: "scheduled",
    notes: "",
  });

  useEffect(() => {
    fetchFields();
    fetchStaff();
    fetchTask();
  }, [id]);

  const fetchFields = async () => {
    const { data } = await supabase.from("turf_fields").select("*").order("name");
    if (data) setFields(data);
  };

  const fetchStaff = async () => {
    const { data } = await supabase.from("users").select("*").in("role", ["admin", "staff"]).order("name");
    if (data) setStaff(data);
  };

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase.from("maintenance_tasks").select("*").eq("id", id).single();
      if (error) throw error;
      if (data) {
        setFormData({
          field_id: data.field_id,
          staff_id: data.staff_id || "",
          task_type: data.task_type,
          scheduled_date: format(new Date(data.scheduled_date), "yyyy-MM-dd'T'HH:mm"),
          completed_date: data.completed_date ? format(new Date(data.completed_date), "yyyy-MM-dd'T'HH:mm") : "",
          status: data.status,
          notes: data.notes || "",
        });
      }
    } catch (err) {
      setError("Failed to load task");
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
      const updateData: Record<string, unknown> = {
        field_id: formData.field_id,
        staff_id: formData.staff_id || null,
        task_type: formData.task_type,
        scheduled_date: formData.scheduled_date,
        status: formData.status,
        notes: formData.notes,
      };

      if (formData.completed_date) {
        updateData.completed_date = formData.completed_date;
      } else {
        updateData.completed_date = null;
      }

      const { error } = await supabase.from("maintenance_tasks").update(updateData).eq("id", id);
      if (error) throw error;
      router.push("/maintenance");
    } catch (err) {
      setError("Failed to update task");
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
            href="/maintenance"
            className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Maintenance Task</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Update task details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <FormSelect
            label="Field"
            value={formData.field_id}
            onChange={(e) => setFormData({ ...formData, field_id: e.target.value })}
            options={[{ value: "", label: "Select a field" }, ...fields.map((f) => ({ value: f.id, label: f.name }))]}
            required
          />

          <FormSelect
            label="Assigned Staff"
            value={formData.staff_id}
            onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
            options={[{ value: "", label: "Select staff (optional)" }, ...staff.map((s) => ({ value: s.id, label: s.name || s.email }))]}
          />

          <FormSelect
            label="Task Type"
            value={formData.task_type}
            onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
            options={taskTypeOptions}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Scheduled Date</label>
            <input
              type="datetime-local"
              value={formData.scheduled_date}
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              required
            />
          </div>

          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={statusOptions}
            required
          />

          {formData.status === "completed" && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Completed Date</label>
              <input
                type="datetime-local"
                value={formData.completed_date}
                onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          )}

          <FormTextarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex gap-2 pt-4">
            <Link
              href="/maintenance"
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
