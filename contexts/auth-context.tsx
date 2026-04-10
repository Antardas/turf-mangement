"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, UserRole } from "@/types";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode; }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				console.log("Session:", session);
				if (session?.user) {
					// Use Supabase to fetch user data
					const { data: userData, error } = await supabase
						.from("users")
						.select("*")
						.eq("id", session.user.id)
						.single();

					if (error || !userData) {
						// User doesn't exist in public.users, create them
						const { data: newUser, error: insertError } = await supabase
							.from("users")
							.insert({
								id: session.user.id,
								email: session.user.email || "",
								name: session.user.user_metadata?.name || session.user.email || "",
								role: session.user.user_metadata?.role || "customer",
								phone: session.user.phone || "",
							})
							.select()
							.single();

						if (!insertError && newUser) {
							setUser(newUser);
						}
					} else {
						setUser(userData);
					}
				}
			} catch (err) {
				console.error("Error fetching user:", err);
			} finally {
				setLoading(false);
			}
		};

		// Add timeout to ensure loading is always cleared
		const timeoutId = setTimeout(() => {
			setLoading(false);
		}, 5000);

		fetchUser();

		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed:", event, session);
			// Handle sign out event immediately
			if (event === 'SIGNED_OUT' || !session?.user) {
				setUser(null);
				return;
			}

			if (session?.user) {
				// Use Supabase to fetch user data
				const { data: userData, error } = await supabase
					.from("users")
					.select("*")
					.eq("id", session.user.id)
					.single();
				console.log("User data:", userData);
				console.log("Error:", error);
				if (error || !userData) {
					// User doesn't exist in public.users, create them
					const { data: newUser, error: insertError } = await supabase
						.from("users")
						.insert({
							id: session.user.id,
							email: session.user.email || "",
							name: session.user.user_metadata?.name || session.user.email || "",
							role: session.user.user_metadata?.role || "customer",
							phone: session.user.phone || "",
						})
						.select()
						.single();

					if (!insertError && newUser) {
						setUser(newUser);
					}
				} else {
					setUser(userData);
				}
			}
		});

		return () => {
			clearTimeout(timeoutId);
			subscription.unsubscribe();
		};
	}, []);

	const signIn = async (email: string, password: string) => {
		const { data: signInData, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;
		console.log(signInData);
		// Immediately fetch and set user data after signin
		if (signInData.user) {
			const supabaseUser = signInData.user;

			const { data: userData, error: fetchError } = await supabase
				.from("users")
				.select("*")
				.eq("id", supabaseUser.id)
				.single();

			if (fetchError || !userData) {
				// User doesn't exist in public.users, create them
				const { data: newUser, error: insertError } = await supabase
					.from("users")
					.insert({
						id: supabaseUser.id,
						email: supabaseUser.email || "",
						name: supabaseUser.user_metadata?.name || supabaseUser.email || "",
						role: supabaseUser.user_metadata?.role || "customer",
						phone: supabaseUser.phone || "",
					})
					.select()
					.single();

				if (insertError) {
					console.error("Failed to create user record:", insertError);
					throw new Error("Failed to create user profile. Please contact support.");
				}

				if (newUser) {
					setUser(newUser);
				}
			} else {
				setUser(userData);
			}
		}
	};

	const signUp = async (email: string, password: string, name: string, role: UserRole = "customer") => {
		const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { name, role }
			}
		});

		if (signUpError) throw signUpError;
		console.log(signUpData);
		// If signup returns a session (auto-signin when email verification is disabled),
		// immediately create user record and set user state
		if (signUpData.user) {
			const supabaseUser = signUpData.user;
			const userMetadata = supabaseUser.user_metadata;

			// Check if user exists in public.users table
			const { data: existingUser, error: fetchError } = await supabase
				.from("users")
				.select("*")
				.eq("id", supabaseUser.id)
				.single();

			if (fetchError || !existingUser) {
				// User doesn't exist in public.users, create them
				const { data: newUser, error: insertError } = await supabase
					.from("users")
					.insert({
						id: supabaseUser.id,
						email: supabaseUser.email || email,
						name: name || userMetadata?.name || email,
						role: role || userMetadata?.role || "customer",
						phone: supabaseUser.phone || "",
					})
					.select()
					.single();

				if (insertError) {
					console.error("Failed to create user record:", insertError);
					throw new Error("Failed to create user profile. Please contact support.");
				}

				if (newUser) {
					setUser(newUser);
				}
			} else {
				setUser(existingUser);
			}
		}
	};

	const signOut = async () => {
		// Clear user state immediately
		setUser(null);
		const { error } = await supabase.auth.signOut();
		if (error) {
			// If signOut fails, we might need to restore state, but for now just throw
			throw error;
		}
	};

	return (
		<AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
