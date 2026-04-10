"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { FormInput } from "@/components/ui/form-input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    fetchLocation();
  }, [id]);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
        });
      }
    } catch (err) {
      setError("Failed to load location");
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
      const { error } = await supabase.from("locations").update(formData).eq("id", id);
      if (error) throw error;
      router.push("/locations");
    } catch (err) {
      setError("Failed to update location");
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
            href="/locations"
            className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Location</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Update location details</p>
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

          <FormInput
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormInput
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />

            <FormInput
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            />

            <FormInput
              label="Zip Code"
              value={formData.zip_code}
              onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Link
              href="/locations"
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
