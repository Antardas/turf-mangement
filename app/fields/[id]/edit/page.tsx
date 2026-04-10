"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Location } from "@/types";

const typeOptions = [
  { value: "grass", label: "Grass" },
  { value: "artificial", label: "Artificial" },
  { value: "hybrid", label: "Hybrid" },
];

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "under_maintenance", label: "Under Maintenance" },
  { value: "booked", label: "Booked" },
];

export default function EditFieldPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location_id: "",
    size: "",
    type: "grass",
    status: "available",
    price_per_hour: "",
    description: "",
  });

  useEffect(() => {
    fetchLocations();
    fetchField();
  }, [id]);

  const fetchLocations = async () => {
    const { data } = await supabase.from("locations").select("*").order("name");
    if (data) setLocations(data);
  };

  const fetchField = async () => {
    try {
      const { data, error } = await supabase.from("turf_fields").select("*").eq("id", id).single();
      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name,
          location_id: data.location_id || "",
          size: data.size,
          type: data.type,
          status: data.status,
          price_per_hour: data.price_per_hour.toString(),
          description: data.description || "",
        });
      }
    } catch (err) {
      setError("Failed to load field");
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
        .from("turf_fields")
        .update({
          ...formData,
          price_per_hour: parseFloat(formData.price_per_hour),
        })
        .eq("id", id);
      if (error) throw error;
      router.push("/fields");
    } catch (err) {
      setError("Failed to update field");
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
            href="/fields"
            className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Field</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Update field details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <FormInput
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <FormSelect
            label="Location"
            value={formData.location_id}
            onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
            options={[{ value: "", label: "Select a location" }, ...locations.map((l) => ({ value: l.id, label: l.name }))]}
            required
          />

          <FormInput
            label="Size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="e.g., 90x60 meters"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={typeOptions}
              required
            />

            <FormSelect
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
              required
            />
          </div>

          <FormInput
            label="Price per Hour"
            type="number"
            min="0"
            step="0.01"
            value={formData.price_per_hour}
            onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
            required
          />

          <FormTextarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex gap-2 pt-4">
            <Link
              href="/fields"
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
