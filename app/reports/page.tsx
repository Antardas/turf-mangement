"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { BarChart3, TrendingUp, Calendar, DollarSign, Users } from "lucide-react";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            View detailed insights about your turf management operations
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">$12,450</p>
                <p className="mt-1 text-xs text-emerald-600">+12% from last month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Bookings</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">284</p>
                <p className="mt-1 text-xs text-emerald-600">+8% from last month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Active Users</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">156</p>
                <p className="mt-1 text-xs text-emerald-600">+15% from last month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Utilization Rate</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">78%</p>
                <p className="mt-1 text-xs text-emerald-600">+5% from last month</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <BarChart3 className="h-8 w-8 text-zinc-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Analytics Dashboard Coming Soon
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Detailed charts and reports are under development. You'll soon be able to track revenue trends, 
                field utilization, and customer analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
