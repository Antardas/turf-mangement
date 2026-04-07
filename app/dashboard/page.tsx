"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { DashboardStats, Booking, MaintenanceTask } from "@/types";
import {
  Calendar,
  DollarSign,
  MapPin,
  Wrench,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { format, isToday, isThisWeek } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalFields: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingMaintenance: 0,
    todayBookings: 0,
    weeklyRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch fields count
        const { count: fieldsCount } = await supabase
          .from("turf_fields")
          .select("*", { count: "exact", head: true });

        // Fetch all bookings with relations
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*, turf_fields(*), users(*)")
          .order("created_at", { ascending: false })
          .limit(10);

        // Fetch maintenance tasks with relations
        const { data: maintenance } = await supabase
          .from("maintenance_tasks")
          .select("*, turf_fields(*), users(*)")
          .eq("status", "scheduled")
          .order("scheduled_date", { ascending: true })
          .limit(5);

        // Calculate stats
        const todayBookingsCount =
          bookings?.filter((b) => isToday(new Date(b.start_time))).length || 0;

        const totalRevenue =
          bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

        const weeklyRevenue =
          bookings
            ?.filter((b) => isThisWeek(new Date(b.created_at)))
            .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

        setStats({
          totalFields: fieldsCount || 0,
          totalBookings: bookings?.length || 0,
          totalRevenue,
          pendingMaintenance: maintenance?.length || 0,
          todayBookings: todayBookingsCount,
          weeklyRevenue,
        });

        setRecentBookings(bookings || []);
        setUpcomingMaintenance(maintenance || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: "Total Fields",
      value: stats.totalFields,
      icon: MapPin,
      change: null,
      color: "bg-blue-500",
    },
    {
      name: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      change: `+${stats.todayBookings} today`,
      changeType: "positive" as const,
      color: "bg-emerald-500",
    },
    {
      name: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `+$${stats.weeklyRevenue.toLocaleString()} this week`,
      changeType: "positive" as const,
      color: "bg-amber-500",
    },
    {
      name: "Pending Maintenance",
      value: stats.pendingMaintenance,
      icon: Wrench,
      change: null,
      color: "bg-orange-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Here&apos;s what&apos;s happening with your turf management today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <div className="mt-2 flex items-center text-sm">
                      <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-600">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Bookings */}
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Recent Bookings
              </h2>
            </div>
            <div className="p-6">
              {recentBookings.length === 0 ? (
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No bookings yet. Start by adding fields and accepting bookings.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-100 p-4 dark:border-zinc-800"
                    >
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {booking.turf_fields?.name || "Unknown Field"}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {format(new Date(booking.start_time), "MMM d, yyyy h:mm a")} -
                          {format(new Date(booking.end_time), "h:mm a")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-zinc-900 dark:text-white">
                          ${booking.total_amount}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Upcoming Maintenance
              </h2>
            </div>
            <div className="p-6">
              {upcomingMaintenance.length === 0 ? (
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No upcoming maintenance scheduled. Keep your fields in top condition!
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingMaintenance.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-100 p-4 dark:border-zinc-800"
                    >
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {task.turf_fields?.name || "Unknown Field"}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          <span className="capitalize">{task.task_type.replace("_", " ")}</span> -{" "}
                          {format(new Date(task.scheduled_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {format(new Date(task.scheduled_date), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
