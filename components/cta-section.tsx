"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-white py-16 dark:bg-zinc-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 text-center shadow-2xl sm:px-16 lg:px-24">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your turf management?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100">
              Start your free trial today and experience the power of professional turf management. 
              No credit card required.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-medium text-emerald-600 transition-all hover:bg-emerald-50"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-400 bg-transparent px-8 py-4 text-base font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Contact Sales
              </Link>
            </div>

            <p className="mt-8 text-sm text-emerald-200">
              Join 2,000+ turf managers who trust our platform
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
