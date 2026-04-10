"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { MaintenanceTask, MaintenanceType } from "@/types";
import {
	Wrench,
	Plus,
	Calendar,
	CheckCircle,
	Clock,
	AlertTriangle,
	Search,
	Filter,
	MapPin,
	Edit,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { format, isPast, isToday } from "date-fns";
import { Modal } from "@/components/ui/modal";

const maintenanceTypes: Record<MaintenanceType, { label: string; color: string; }> = {
	watering: { label: "Watering", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
	mowing: { label: "Mowing", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
	fertilizing: { label: "Fertilizing", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
	aerating: { label: "Aerating", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
	pest_control: { label: "Pest Control", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
	general_inspection: { label: "Inspection", color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400" },
};

export default function MaintenancePage() {
	const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [deleteId, setDeleteId] = useState<string | null>(null);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const { data, error } = await supabase
					.from("maintenance_tasks")
					.select("*, turf_fields(*), users(*)")
					.order("scheduled_date", { ascending: true });

				if (error) {
					console.error("Error fetching maintenance tasks:", error);
					setTasks([]);
				} else {
					setTasks(data || []);
				}
			} catch (error) {
				console.error("Error fetching maintenance tasks:", error);
				setTasks([]);
			} finally {
				setLoading(false);
			}
		};

		// Add timeout to prevent infinite loading
		const timeoutId = setTimeout(() => {
			setLoading(false);
		}, 5000);

		fetchTasks();

		return () => clearTimeout(timeoutId);
	}, []);

	const filteredTasks = tasks.filter((task) => {
		const matchesSearch =
			task.turf_fields?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.task_type.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			filterStatus === "all" || task.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string, scheduledDate: string) => {
		const isOverdue = isPast(new Date(scheduledDate)) && status !== "completed";

		switch (status) {
			case "scheduled":
				return (
					<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isOverdue
						? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
						: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
						}`}>
						{isOverdue ? (
							<>
								<AlertTriangle className="mr-1 h-3 w-3" />
								Overdue
							</>
						) : (
							<>
								<Calendar className="mr-1 h-3 w-3" />
								Scheduled
							</>
						)}
					</span>
				);
			case "in_progress":
				return (
					<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
						<Clock className="mr-1 h-3 w-3" />
						In Progress
					</span>
				);
			case "completed":
				return (
					<span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
						<CheckCircle className="mr-1 h-3 w-3" />
						Completed
					</span>
				);
			case "cancelled":
				return (
					<span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
						Cancelled
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

	const getTypeBadge = (type: MaintenanceType) => {
		const config = maintenanceTypes[type] || { label: type, color: "bg-zinc-100 text-zinc-800" };
		return (
			<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
				{config.label}
			</span>
		);
	};

	// Group tasks by status for the overview
	const scheduledCount = tasks.filter(t => t.status === "scheduled").length;
	const inProgressCount = tasks.filter(t => t.status === "in_progress").length;
	const completedCount = tasks.filter(t => t.status === "completed").length;
	const overdueCount = tasks.filter(t =>
		t.status === "scheduled" && isPast(new Date(t.scheduled_date))
	).length;

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
							Maintenance
						</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
							Schedule and track field maintenance tasks
						</p>
					</div>
					<Link
						href="/maintenance/new"
						className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
					>
						<Plus className="mr-2 h-4 w-4" />
						Schedule Task
					</Link>
				</div>

				{/* Stats Overview */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">Scheduled</p>
								<p className="text-2xl font-bold text-zinc-900 dark:text-white">{scheduledCount}</p>
							</div>
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
								<Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
					</div>
					<div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">In Progress</p>
								<p className="text-2xl font-bold text-zinc-900 dark:text-white">{inProgressCount}</p>
							</div>
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
								<Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
							</div>
						</div>
					</div>
					<div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">Completed</p>
								<p className="text-2xl font-bold text-zinc-900 dark:text-white">{completedCount}</p>
							</div>
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
								<CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
							</div>
						</div>
					</div>
					<div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-zinc-600 dark:text-zinc-400">Overdue</p>
								<p className={`text-2xl font-bold ${overdueCount > 0 ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-white"}`}>
									{overdueCount}
								</p>
							</div>
							<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${overdueCount > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-zinc-100 dark:bg-zinc-800"}`}>
								<AlertTriangle className={`h-5 w-5 ${overdueCount > 0 ? "text-red-600 dark:text-red-400" : "text-zinc-500"}`} />
							</div>
						</div>
					</div>
				</div>

				{/* Filters */}
				<div className="flex flex-col gap-4 sm:flex-row">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
						<input
							type="text"
							placeholder="Search maintenance tasks..."
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
							<option value="scheduled">Scheduled</option>
							<option value="in_progress">In Progress</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>
				</div>

				{/* Tasks List */}
				{loading ? (
					<div className="flex h-64 items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
					</div>
				) : filteredTasks.length === 0 ? (
					<div className="flex h-64 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
						<Wrench className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
						<h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
							No maintenance tasks
						</h3>
						<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
							Schedule your first maintenance task to keep fields in top condition
						</p>
						<Link
							href="/maintenance/new"
							className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
						>
							<Plus className="mr-2 h-4 w-4" />
							Schedule Task
						</Link>
					</div>
				) : (
					<div className="space-y-4">
						{filteredTasks.map((task) => (
							<div
								key={task.id}
								className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900"
							>
								<div className="flex items-start gap-4">
									<div className={`flex h-12 w-12 items-center justify-center rounded-lg ${task.status === "completed"
										? "bg-emerald-100 dark:bg-emerald-900/30"
										: task.status === "in_progress"
											? "bg-yellow-100 dark:bg-yellow-900/30"
											: "bg-blue-100 dark:bg-blue-900/30"
										}`}>
										<Wrench className={`h-6 w-6 ${task.status === "completed"
											? "text-emerald-600 dark:text-emerald-400"
											: task.status === "in_progress"
												? "text-yellow-600 dark:text-yellow-400"
												: "text-blue-600 dark:text-blue-400"
											}`} />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-semibold text-zinc-900 dark:text-white">
												{task.turf_fields?.name || "Unknown Field"}
											</h3>
											{getTypeBadge(task.task_type)}
										</div>
										<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
											{task.notes || `Scheduled ${task.task_type.replace("_", " ")}`}
										</p>
										<div className="mt-2 flex items-center gap-4 text-sm">
											<span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
												<Calendar className="h-4 w-4" />
												{format(new Date(task.scheduled_date), "MMM d, yyyy")}
											</span>
											{task.users && (
												<span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
													<MapPin className="h-4 w-4" />
													Assigned to: {task.users.name}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{getStatusBadge(task.status, task.scheduled_date)}
									<Link
										href={`/maintenance/${task.id}/edit`}
										className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
									>
										<Edit className="h-4 w-4" />
									</Link>
									<button
										onClick={() => setDeleteId(task.id)}
										className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Task">
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
									const { error } = await supabase.from("maintenance_tasks").delete().eq("id", deleteId);
									if (error) throw error;
									setTasks(tasks.filter((t) => t.id !== deleteId));
								} catch (err) {
									console.error("Error deleting task:", err);
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
