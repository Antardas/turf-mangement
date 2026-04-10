-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable btree_gist extension for tsrange (booking overlap prevention)
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (
        role IN ('admin', 'staff', 'customer')
    ),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turf Fields table
CREATE TABLE IF NOT EXISTS public.turf_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    location_id UUID REFERENCES public.locations (id) ON DELETE SET NULL,
    size TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN (
            'grass',
            'artificial',
            'hybrid'
        )
    ),
    status TEXT NOT NULL CHECK (
        status IN (
            'available',
            'under_maintenance',
            'booked'
        )
    ) DEFAULT 'available',
    price_per_hour DECIMAL(10, 2) NOT NULL,
    description TEXT,
    images TEXT [],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    field_id UUID NOT NULL REFERENCES public.turf_fields (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (
        status IN (
            'pending',
            'confirmed',
            'cancelled',
            'completed'
        )
    ) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Tasks table
CREATE TABLE IF NOT EXISTS public.maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    field_id UUID NOT NULL REFERENCES public.turf_fields (id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.users (id) ON DELETE SET NULL,
    task_type TEXT NOT NULL CHECK (
        task_type IN (
            'watering',
            'mowing',
            'fertilizing',
            'aerating',
            'pest_control',
            'general_inspection'
        )
    ),
    scheduled_date TIMESTAMPTZ NOT NULL,
    completed_date TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (
        status IN (
            'scheduled',
            'in_progress',
            'completed',
            'cancelled'
        )
    ) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN (
            'booking_confirmation',
            'booking_reminder',
            'maintenance_reminder',
            'system'
        )
    ),
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_turf_fields_location_id ON public.turf_fields (location_id);

CREATE INDEX IF NOT EXISTS idx_turf_fields_status ON public.turf_fields (status);

CREATE INDEX IF NOT EXISTS idx_bookings_field_id ON public.bookings (field_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings (user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings (start_time);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);

CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_field_id ON public.maintenance_tasks (field_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_staff_id ON public.maintenance_tasks (staff_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_scheduled_date ON public.maintenance_tasks (scheduled_date);

CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_status ON public.maintenance_tasks (status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON public.notifications (read_status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.turf_fields ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE
    USING (auth.uid () = id);

CREATE POLICY "Admins can view all users" ON public.users FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all users" ON public.users
FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

-- RLS Policies for locations table
CREATE POLICY "Locations are viewable by everyone" ON public.locations FOR
SELECT TO authenticated, anon USING (true);

CREATE POLICY "Only admins can insert locations" ON public.locations FOR INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update locations" ON public.locations
FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete locations" ON public.locations FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.users
        WHERE
            id = auth.uid ()
            AND role = 'admin'
    )
);

-- RLS Policies for turf_fields table
CREATE POLICY "Turf fields are viewable by everyone" ON public.turf_fields FOR
SELECT TO authenticated, anon USING (true);

CREATE POLICY "Only admins can insert turf fields" ON public.turf_fields FOR INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update turf fields" ON public.turf_fields
FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete turf fields" ON public.turf_fields FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.users
        WHERE
            id = auth.uid ()
            AND role = 'admin'
    )
);

-- RLS Policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert their own bookings" ON public.bookings FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY "Admins and staff can view all bookings" ON public.bookings FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins and staff can update all bookings" ON public.bookings
FOR UPDATE
    USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role IN ('admin', 'staff')
        )
    );

-- RLS Policies for maintenance_tasks table
CREATE POLICY "Admins and staff can view all maintenance tasks" ON public.maintenance_tasks FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Staff can update their assigned tasks" ON public.maintenance_tasks
FOR UPDATE
    USING (
        staff_id = auth.uid ()
        OR EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can insert maintenance tasks" ON public.maintenance_tasks FOR INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM public.users
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete maintenance tasks" ON public.maintenance_tasks FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.users
        WHERE
            id = auth.uid ()
            AND role = 'admin'
    )
);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT
WITH
    CHECK (true);

-- Function to handle user creation after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile after signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();