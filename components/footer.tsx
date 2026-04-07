"use client";

import Link from "next/link";
import { Globe, MessageCircle, Star, Link2, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
	Product: [
		{ name: "Features", href: "/features" },
		{ name: "Pricing", href: "/pricing" },
		{ name: "Integrations", href: "/integrations" },
		{ name: "Changelog", href: "/changelog" },
	],
	Company: [
		{ name: "About Us", href: "/about" },
		{ name: "Careers", href: "/careers" },
		{ name: "Blog", href: "/blog" },
		{ name: "Press", href: "/press" },
	],
	Resources: [
		{ name: "Documentation", href: "/docs" },
		{ name: "Help Center", href: "/help" },
		{ name: "API Reference", href: "/api" },
		{ name: "Status", href: "/status" },
	],
	Legal: [
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "Terms of Service", href: "/terms" },
		{ name: "Cookie Policy", href: "/cookies" },
		{ name: "GDPR", href: "/gdpr" },
	],
};

const socialLinks = [
	{ name: "Website", href: "#", icon: Globe },
	{ name: "Messages", href: "#", icon: MessageCircle },
	{ name: "Reviews", href: "#", icon: Star },
	{ name: "Links", href: "#", icon: Link2 },
];

export function Footer() {
	return (
		<footer className="bg-zinc-50 dark:bg-zinc-900">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-8 lg:grid-cols-5">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
								<span className="text-lg font-bold text-white">T</span>
							</div>
							<span className="text-xl font-bold text-zinc-900 dark:text-white">
								TurfManager
							</span>
						</Link>
						<p className="mt-4 max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
							Professional turf management platform for booking, maintenance, and analytics.
							Built for modern sports facilities.
						</p>

						{/* Contact Info */}
						<div className="mt-6 space-y-3">
							<a
								href="mailto:support@turfmanager.com"
								className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
							>
								<Mail className="h-4 w-4" />
								support@turfmanager.com
							</a>
							<a
								href="tel:+1234567890"
								className="flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
							>
								<Phone className="h-4 w-4" />
								+1 (234) 567-890
							</a>
							<p className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
								<MapPin className="h-4 w-4" />
								San Francisco, CA
							</p>
						</div>

						{/* Social Links */}
						<div className="mt-6 flex gap-4">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									className="text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
								>
									<span className="sr-only">{social.name}</span>
									<social.icon className="h-5 w-5" />
								</a>
							))}
						</div>
					</div>

					{/* Links */}
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
						{Object.entries(footerLinks).map(([category, links]) => (
							<div key={category}>
								<h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
									{category}
								</h3>
								<ul className="mt-4 space-y-3">
									{links.map((link) => (
										<li key={link.name}>
											<Link
												href={link.href}
												className="text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
											>
												{link.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							© {new Date().getFullYear()} TurfManager. All rights reserved.
						</p>
						<div className="flex gap-6">
							<Link
								href="/privacy"
								className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
							>
								Privacy
							</Link>
							<Link
								href="/terms"
								className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
							>
								Terms
							</Link>
							<Link
								href="/sitemap"
								className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
							>
								Sitemap
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
