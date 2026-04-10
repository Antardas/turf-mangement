"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function NewFieldPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
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
	}, []);

	const fetchLocations = async () => {
		const { data } = await supabase.from("locations").select("*").order("name");
		if (data) setLocations(data);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { error } = await supabase.from("turf_fields").insert([{
				...formData,
				price_per_hour: parseFloat(formData.price_per_hour),
			}]);
			if (error) throw error;
			router.push("/fields");
		} catch (err) {
			setError("Failed to create field");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

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
						<h1 className="text-2xl font-bold text-zinc-900 dark:text-white">New Field</h1>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">Add a new turf field</p>
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

					<div>
						<FormSelect
							label="Location"
							value={formData.location_id}
							onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
							options={[{ value: "", label: "Select a location" }, ...locations.map((l) => ({ value: l.id, label: l.name }))]}
							required
							disabled={locations.length === 0}
						/>
						{locations.length === 0 && (
							<p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
								No locations available.{" "}
								<Link href="/locations/new" className="underline hover:text-amber-700">
									Create a location first →
								</Link>
							</p>
						)}
					</div>

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
							disabled={loading}
							className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
						>
							{loading ? "Creating..." : "Create Field"}
						</button>
					</div>
				</form>
			</div>
		</DashboardLayout>
	);
}
