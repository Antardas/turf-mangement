"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { Location } from "@/types";
import { MapPin, Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase.from("locations").delete().eq("id", deleteId);
      if (error) throw error;
      setLocations(locations.filter((l) => l.id !== deleteId));
    } catch (error) {
      console.error("Error deleting location:", error);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Locations</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage field locations</p>
          </div>
          <Link
            href="/locations/new"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <MapPin className="h-12 w-12 text-zinc-300" />
            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">No locations found</h3>
            <Link
              href="/locations/new"
              className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/locations/${location.id}/edit`}
                      className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(location.id)}
                      className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{location.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{location.address}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{location.city}, {location.state} {location.zip_code}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Location">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Are you sure? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleteId(null)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
