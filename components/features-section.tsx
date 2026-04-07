"use client";

import {
  Calendar,
  Users,
  Wrench,
  Bell,
  BarChart3,
  Shield,
  Clock,
  MapPin,
} from "lucide-react";

const features = [
  {
    name: "Field Management",
    description:
      "Easily manage multiple turf locations, track field conditions, and update availability in real-time.",
    icon: MapPin,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    name: "Smart Booking System",
    description:
      "Prevent double-bookings with our conflict-free scheduling. Customers can view availability and book instantly.",
    icon: Calendar,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    name: "Maintenance Scheduling",
    description:
      "Schedule watering, mowing, fertilizing, and inspections. Track completion and maintain field quality.",
    icon: Wrench,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    name: "User Management",
    description:
      "Role-based access for admins, staff, and customers. Manage permissions and track user activities.",
    icon: Users,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    name: "Automated Notifications",
    description:
      "Send email and SMS reminders for bookings and maintenance. Keep everyone informed automatically.",
    icon: Bell,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    name: "Reports & Analytics",
    description:
      "Generate usage reports, track revenue, and analyze field utilization with beautiful charts.",
    icon: BarChart3,
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    name: "Real-time Updates",
    description:
      "Live updates for maintenance status and booking changes. Everyone sees the latest information instantly.",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    name: "Secure Access",
    description:
      "Enterprise-grade security with authentication, authorization, and data encryption built-in.",
    icon: Shield,
    color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
            Powerful Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Everything you need to manage turf fields
          </p>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            From booking to maintenance, our platform provides all the tools you need to run your turf management business efficiently.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
