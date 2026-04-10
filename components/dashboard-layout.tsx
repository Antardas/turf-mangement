"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
	LayoutDashboard,
	Calendar,
	MapPin,
	Wrench,
	Users,
	BarChart3,
	Settings,
	LogOut,
	ChevronRight,
} from "lucide-react";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Fields", href: "/fields", icon: MapPin },
	{ name: "Bookings", href: "/bookings", icon: Calendar },
	{ name: "Maintenance", href: "/maintenance", icon: Wrench },
	{ name: "Users", href: "/users", icon: Users },
	{ name: "Reports", href: "/reports", icon: BarChart3 },
	{ name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode; }) {
	const pathname = usePathname();
	const router = useRouter();
	const { user, signOut } = useAuth();

	const handleSignOut = async () => {
		await signOut();
		router.push("/login");
	};

	return (
		<div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
			{/* Sidebar */}
			<aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
				{/* Logo */}
				<div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6 dark:border-zinc-800">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
						<span className="text-lg font-bold text-white">T</span>
					</div>
					<span className="text-lg font-bold text-zinc-900 dark:text-white">
						TurfManager
					</span>
				</div>

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto p-4">
					<ul className="space-y-1">
						{navigation.map((item) => {
							const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
							return (
								<li key={item.name}>
									<Link
										href={item.href}
										className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
											? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
											: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
											}`}
									>
										<item.icon className="h-5 w-5" />
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* User Profile */}
				<div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
							<span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
								{user?.name?.charAt(0) || "U"}
							</span>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
								{user?.name || "User"}
							</p>
							<p className="text-xs text-zinc-500 dark:text-zinc-400 truncate capitalize">
								{user?.role || "customer"}
							</p>
						</div>
						<button
							onClick={handleSignOut}
							className="p-2 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
							title="Sign out"
						>
							<LogOut className="h-5 w-5" />
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex flex-1 flex-col overflow-hidden">
				{/* Mobile Header */}
				<header className="flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
							<span className="text-lg font-bold text-white">T</span>
						</div>
						<span className="text-lg font-bold text-zinc-900 dark:text-white">
							TurfManager
						</span>
					</div>
				</header>

				{/* Content Area */}
				<main className="flex-1 overflow-y-auto p-4 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}
