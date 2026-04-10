"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Navigation } from "@/components/navigation";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const { signIn, user } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [signinSuccess, setSigninSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	// Redirect to dashboard when user is set after successful signin
	useEffect(() => {
		if (signinSuccess && user) {
			router.push("/dashboard");
		}
	}, [signinSuccess, user, router]);

	const onSubmit = async (data: LoginFormData) => {
		try {
			setIsLoading(true);
			setError("");
			await signIn(data.email, data.password);
			setSigninSuccess(true);
		} catch (err: any) {
			setError(err.message || "Failed to sign in");
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />
			<main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div className="text-center">
						<h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
							Welcome back
						</h2>
						<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
							Don't have an account?{" "}
							<Link
								href="/register"
								className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
							>
								Sign up
							</Link>
						</p>
					</div>

					{error && (
						<div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Email address
							</label>
							<input
								{...register("email")}
								type="email"
								autoComplete="email"
								className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
								placeholder="you@example.com"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Password
							</label>
							<div className="relative mt-1">
								<input
									{...register("password")}
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white sm:text-sm"
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
							)}
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300"
								>
									Remember me
								</label>
							</div>

							<Link
								href="/forgot-password"
								className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
							>
								Forgot password?
							</Link>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}
