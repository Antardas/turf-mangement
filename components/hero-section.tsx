"use client";

import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-900 dark:bg-emerald-950/50">
            <span className="mr-2 text-emerald-600">✨</span>
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Now with AI-powered scheduling
            </span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Manage Your Turf Fields
            <span className="text-emerald-600 dark:text-emerald-400"> Like a Pro</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Streamline your turf management with our comprehensive platform. 
            Book fields, schedule maintenance, and track usage—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-4 text-base font-medium text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-8 py-4 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              Watch Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Cancel anytime
            </span>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid gap-8 sm:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Smart Booking
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Real-time availability with automatic conflict prevention
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Maintenance Tracking
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Never miss watering, mowing, or fertilizing schedules
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Usage Analytics
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Comprehensive reports on revenue and field utilization
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] overflow-hidden">
        <div className="absolute -left-[40%] top-0 h-[600px] w-[80%] rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
        <div className="absolute -right-[40%] top-[20%] h-[400px] w-[60%] rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-800/20" />
      </div>
    </section>
  );
}
