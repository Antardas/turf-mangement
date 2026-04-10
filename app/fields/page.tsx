"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { TurfField } from "@/types";
import { MapPin, Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Link from "next/link";

export default function FieldsPage() {
	const [fields, setFields] = useState<TurfField[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [deleteId, setDeleteId] = useState<string | null>(null);

	useEffect(() => {
		const fetchFields = async () => {
			try {
				const { data, error } = await supabase
					.from("turf_fields")
					.select("*, locations(*)")
					.order("created_at", { ascending: false });

				if (error) throw error;
				setFields(data || []);
			} catch (error) {
				console.error("Error fetching fields:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchFields();
	}, []);

	const filteredFields = fields.filter((field) => {
		const matchesSearch =
			field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			field.location?.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			filterStatus === "all" || field.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "available":
				return (
					<span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
						<CheckCircle className="mr-1 h-3 w-3" />
						Available
					</span>
				);
			case "under_maintenance":
				return (
					<span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
						<XCircle className="mr-1 h-3 w-3" />
						Maintenance
					</span>
				);
			case "booked":
				return (
					<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
						<CheckCircle className="mr-1 h-3 w-3" />
						Booked
					</span>
				);
			default:
				return (
					<span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
						{status}
					</span>
				);
		}
	};

	const getTypeBadge = (type: string) => {
		const colors: Record<string, string> = {
			grass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
			artificial: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
			hybrid: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
		};
		return (
			<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[type] || colors.grass}`}>
				{type.charAt(0).toUpperCase() + type.slice(1)}
			</span>
		);
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
							Fields
						</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
							Manage your turf fields and their availability
						</p>
					</div>
					<Link
						href="/fields/new"
						className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Field
					</Link>
				</div>

				{/* Filters */}
				<div className="flex flex-col gap-4 sm:flex-row">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
						<input
							type="text"
							placeholder="Search fields..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-zinc-500" />
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
						>
							<option value="all">All Status</option>
							<option value="available">Available</option>
							<option value="under_maintenance">Under Maintenance</option>
							<option value="booked">Booked</option>
						</select>
					</div>
				</div>

				{/* Fields Grid */}
				{loading ? (
					<div className="flex h-64 items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
					</div>
				) : filteredFields.length === 0 ? (
					<div className="flex h-64 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
						<MapPin className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
						<h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
							No fields found
						</h3>
						<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
							{searchQuery || filterStatus !== "all"
								? "Try adjusting your search or filters"
								: "Get started by adding your first field"}
						</p>
						{!searchQuery && filterStatus === "all" && (
							<Link
								href="/fields/new"
								className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Field
							</Link>
						)}
					</div>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filteredFields.map((field) => (
							<div
								key={field.id}
								className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
							>
								{/* Header */}
								<div className="flex items-start justify-between">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
										<MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
									</div>
									<div className="flex items-center gap-2">
										{getStatusBadge(field.status)}
									</div>
								</div>

								{/* Content */}
								<div className="mt-4">
									<h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
										{field.name}
									</h3>
									<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
										{field.location?.name || "No location assigned"}
									</p>

									{/* Details */}
									<div className="mt-4 space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="text-zinc-500 dark:text-zinc-400">Type</span>
											{getTypeBadge(field.type)}
										</div>
										<div className="flex items-center justify-between text-sm">
											<span className="text-zinc-500 dark:text-zinc-400">Size</span>
											<span className="font-medium text-zinc-900 dark:text-white">
												{field.size}
											</span>
										</div>
										<div className="flex items-center justify-between text-sm">
											<span className="text-zinc-500 dark:text-zinc-400">Price/Hour</span>
											<span className="font-medium text-emerald-600 dark:text-emerald-400">
												${field.price_per_hour}
											</span>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="mt-6 flex items-center justify-between gap-2">
									<Link
										href={`/fields/${field.id}`}
										className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
									>
										View Details
									</Link>
									<Link
										href={`/fields/${field.id}/edit`}
										className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
									>
										<Edit className="h-4 w-4" />
									</Link>
									<button
										onClick={() => setDeleteId(field.id)}
										className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Field">
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Are you sure? This action cannot be undone.</p>
					<div className="mt-4 flex justify-end gap-2">
						<button
							onClick={() => setDeleteId(null)}
							className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
						>
							Cancel
						</button>
						<button
							onClick={async () => {
								if (!deleteId) return;
								try {
									const { error } = await supabase.from("turf_fields").delete().eq("id", deleteId);
									if (error) throw error;
									setFields(fields.filter((f) => f.id !== deleteId));
								} catch (err) {
									console.error("Error deleting field:", err);
								} finally {
									setDeleteId(null);
								}
							}}
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
