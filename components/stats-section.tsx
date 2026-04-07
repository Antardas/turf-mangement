"use client";

import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react";

const stats = [
  {
    name: "Active Users",
    value: "2,000+",
    description: "Turf managers worldwide",
    icon: Users,
  },
  {
    name: "Bookings Managed",
    value: "50K+",
    description: "Successfully processed",
    icon: Calendar,
  },
  {
    name: "Revenue Tracked",
    value: "$5M+",
    description: "Through our platform",
    icon: DollarSign,
  },
  {
    name: "Growth Rate",
    value: "150%",
    description: "Year over year",
    icon: TrendingUp,
  },
];

export function StatsSection() {
  return (
    <section className="bg-emerald-900 py-16 dark:bg-emerald-950 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by turf managers worldwide
          </h2>
          <p className="mt-4 text-lg text-emerald-100">
            Join thousands of professionals who trust our platform for their turf management needs.
          </p>
        </div>

        <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="flex flex-col items-center rounded-2xl bg-emerald-800/50 px-6 py-8 text-center dark:bg-emerald-900/50"
            >
              <dt className="order-2 mt-4 text-sm font-medium text-emerald-200">
                {stat.name}
              </dt>
              <dd className="order-1 text-4xl font-bold tracking-tight text-white">
                {stat.value}
              </dd>
              <dd className="order-3 mt-1 text-xs text-emerald-300">
                {stat.description}
              </dd>
              <stat.icon className="order-0 mb-4 h-8 w-8 text-emerald-300" />
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
