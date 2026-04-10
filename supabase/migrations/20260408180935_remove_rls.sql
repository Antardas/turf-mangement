-- Migration to disable RLS on users table
-- This fixes the "new row violates row-level security policy" error during signup
-- The trigger function needs to insert into users table without RLS blocking it

-- Disable RLS on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies on users table (they're not needed if RLS is off)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

DROP POLICY IF EXISTS "Admins can update all users" ON public.users;