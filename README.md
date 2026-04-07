# TurfManager - Professional Turf Management System

A comprehensive web-based platform for managing turf/grass fields efficiently, including booking, maintenance scheduling, and usage tracking.

## Features

- **Field Management**: Add, edit, and manage multiple turf locations with real-time status tracking
- **Smart Booking System**: Real-time availability with automatic conflict prevention
- **Maintenance Scheduling**: Schedule and track watering, mowing, fertilizing, and inspections
- **User Management**: Role-based access control (Admin, Staff, Customer)
- **Automated Notifications**: Email and SMS reminders for bookings and maintenance
- **Reports & Analytics**: Usage reports, maintenance history, and revenue tracking
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16+, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Forms**: React Hook Form with Zod validation
- **Database**: PostgreSQL via Supabase client

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd turf-mangement
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Set up the database using Drizzle:
    - Drizzle will automatically create the database schema based on the schema definitions
    - Run migrations using: `npx drizzle-kit push:pg`
    - Or use `npx drizzle-kit generate` to create migration files first

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
turf-mangement/
├── app/                    # Next.js app router pages
├── components/           # Reusable React components
├── contexts/            # React contexts
├── lib/                 # Utility functions
│   └── supabase.ts      # Supabase client
├── types/               # TypeScript types
├── public/              # Static assets
├── .env.local          # Environment variables
└── package.json
```

## User Roles

- **Admin**: Full access to manage fields, bookings, users, and maintenance schedules
- **Staff**: Update maintenance status and assist with bookings
- **Customer**: View field availability and make bookings

## Database Schema

The system uses the following main tables:

- `users`: User profiles and roles
- `locations`: Turf field locations
- `turf_fields`: Field details, pricing, and status
- `bookings`: Reservation records with conflict prevention
- `maintenance_tasks`: Scheduled and completed maintenance
- `notifications`: User notifications and alerts

See `supabase/schema.sql` for complete schema with RLS policies.

## Key Features

### Double-Booking Prevention

The booking system uses PostgreSQL EXCLUDE constraints to prevent overlapping bookings for the same field.

### Real-time Updates

Supabase Realtime provides live updates for:

- Field availability changes
- Maintenance status updates
- New bookings

### Responsive Design

Built with Tailwind CSS for optimal viewing on desktop, tablet, and mobile devices.

## Development

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Deployment

The application can be deployed to Vercel:

```bash
vercel --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@turfmanager.com or open an issue in the repository.
