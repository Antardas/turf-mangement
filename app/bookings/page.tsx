"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { Booking } from "@/types";
import {
	Calendar,
	Plus,
	Search,
	Filter,
	Clock,
	DollarSign,
	MapPin,
	CheckCircle,
	XCircle,
	Clock3,
	Edit,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Modal } from "@/components/ui/modal";

export default function BookingsPage() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [deleteId, setDeleteId] = useState<string | null>(null);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const { data, error } = await supabase
					.from("bookings")
					.select("*, turf_fields(*), users(*)")
					.order("start_time", { ascending: false });

				if (error) {
					console.error("Error fetching bookings:", error);
					setBookings([]);
				} else {
					setBookings(data || []);
				}
			} catch (error) {
				console.error("Error fetching bookings:", error);
				setBookings([]);
			} finally {
				setLoading(false);
			}
		};

		// Add timeout to prevent infinite loading
		const timeoutId = setTimeout(() => {
			setLoading(false);
		}, 5000);

		fetchBookings();

		return () => clearTimeout(timeoutId);
	}, []);

	const filteredBookings = bookings.filter((booking) => {
		const matchesSearch =
			booking.turf_fields?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			booking.users?.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			filterStatus === "all" || booking.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "confirmed":
				return (
					<span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
						<CheckCircle className="mr-1 h-3 w-3" />
						Confirmed
					</span>
				);
			case "pending":
				return (
					<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
						<Clock3 className="mr-1 h-3 w-3" />
						Pending
					</span>
				);
			case "cancelled":
				return (
					<span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
						<XCircle className="mr-1 h-3 w-3" />
						Cancelled
					</span>
				);
			case "completed":
				return (
					<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
						<CheckCircle className="mr-1 h-3 w-3" />
						Completed
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

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
							Bookings
						</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
							Manage field bookings and reservations
						</p>
					</div>
					<Link
						href="/bookings/new"
						className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
					>
						<Plus className="mr-2 h-4 w-4" />
						New Booking
					</Link>
				</div>

				{/* Filters */}
				<div className="flex flex-col gap-4 sm:flex-row">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
						<input
							type="text"
							placeholder="Search bookings..."
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
							<option value="pending">Pending</option>
							<option value="confirmed">Confirmed</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>
				</div>

				{/* Bookings Table */}
				{loading ? (
					<div className="flex h-64 items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
					</div>
				) : filteredBookings.length === 0 ? (
					<div className="flex h-64 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
						<Calendar className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
						<h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
							No bookings found
						</h3>
						<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
							{searchQuery || filterStatus !== "all"
								? "Try adjusting your search or filters"
								: "Get started by creating your first booking"}
						</p>
						{!searchQuery && filterStatus === "all" && (
							<Link
								href="/bookings/new"
								className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
							>
								<Plus className="mr-2 h-4 w-4" />
								New Booking
							</Link>
						)}
					</div>
				) : (
					<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
						<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
							<thead className="bg-zinc-50 dark:bg-zinc-800/50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
										Field
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
										Date & Time
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
										Amount
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
										Status
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
								{filteredBookings.map((booking) => (
									<tr key={booking.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
										<td className="whitespace-nowrap px-6 py-4">
											<div className="flex items-center">
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
													<MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
												</div>
												<div className="ml-3">
													<p className="text-sm font-medium text-zinc-900 dark:text-white">
														{booking.turf_fields?.name}
													</p>
												</div>
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<p className="text-sm text-zinc-900 dark:text-white">
												{booking.users?.name}
											</p>
											<p className="text-xs text-zinc-500 dark:text-zinc-400">
												{booking.users?.email}
											</p>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<div className="flex items-center text-sm text-zinc-900 dark:text-white">
												<Clock className="mr-1 h-4 w-4 text-zinc-400" />
												{format(new Date(booking.start_time), "MMM d, yyyy")}
											</div>
											<p className="text-xs text-zinc-500 dark:text-zinc-400">
												{format(new Date(booking.start_time), "h:mm a")} -{" "}
												{format(new Date(booking.end_time), "h:mm a")}
											</p>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<div className="flex items-center text-sm font-medium text-zinc-900 dark:text-white">
												<DollarSign className="mr-1 h-4 w-4 text-emerald-600" />
												{booking.total_amount}
											</div>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											{getStatusBadge(booking.status)}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end gap-2">
												<Link
													href={`/bookings/${booking.id}/edit`}
													className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
												>
													<Edit className="h-4 w-4" />
												</Link>
												<button
													onClick={() => setDeleteId(booking.id)}
													className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Booking">
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
									const { error } = await supabase.from("bookings").delete().eq("id", deleteId);
									if (error) throw error;
									setBookings(bookings.filter((b) => b.id !== deleteId));
								} catch (err) {
									console.error("Error deleting booking:", err);
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
