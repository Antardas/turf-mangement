export type UserRole = 'admin' | 'staff' | 'customer';

export interface User {
	id: string;
	email: string;
	role: UserRole;
	name: string;
	phone?: string;
	created_at: string;
	updated_at: string;
}

export interface Location {
	id: string;
	name: string;
	address: string;
	city: string;
	state: string;
	zip_code: string;
	created_at: string;
	updated_at: string;
}

export interface TurfField {
	id: string;
	name: string;
	location_id: string;
	size: string;
	type: 'grass' | 'artificial' | 'hybrid';
	status: 'available' | 'under_maintenance' | 'booked';
	price_per_hour: number;
	description?: string;
	images?: string[];
	created_at: string;
	updated_at: string;
	location?: Location;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
	id: string;
	field_id: string;
	user_id: string;
	start_time: string;
	end_time: string;
	status: BookingStatus;
	total_amount: number;
	notes?: string;
	created_at: string;
	updated_at: string;
	turf_fields?: TurfField;
	users?: User;
}

export type MaintenanceType =
	| 'watering'
	| 'mowing'
	| 'fertilizing'
	| 'aerating'
	| 'pest_control'
	| 'general_inspection';

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface MaintenanceTask {
	id: string;
	field_id: string;
	staff_id?: string;
	task_type: MaintenanceType;
	scheduled_date: string;
	completed_date?: string;
	status: MaintenanceStatus;
	notes?: string;
	created_at: string;
	updated_at: string;
	turf_fields?: TurfField;
	users?: User;
}

export type NotificationType =
	| 'booking_confirmation'
	| 'booking_reminder'
	| 'maintenance_reminder'
	| 'system';

export interface Notification {
	id: string;
	user_id: string;
	message: string;
	type: NotificationType;
	read_status: boolean;
	created_at: string;
	updated_at: string;
}

export interface DashboardStats {
	totalFields: number;
	totalBookings: number;
	totalRevenue: number;
	pendingMaintenance: number;
	todayBookings: number;
	weeklyRevenue: number;
}

// Helper types for joined queries
export type TurfFieldWithLocation = TurfField & {
	location?: Location;
};

export type BookingWithRelations = Booking;
export type MaintenanceTaskWithRelations = MaintenanceTask;
