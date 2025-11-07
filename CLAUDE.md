# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the Milkyano Barber Web application - a modern booking platform for Fadedlines Barbershop. The application enables customers to view barber profiles, browse services, and book appointments through integration with Square API.

## Common Development Commands

```bash
# Install dependencies (uses Yarn - specified in package.json)
yarn install

# Start development server (Vite, default port 5173)
yarn dev

# Build for production (runs TypeScript compiler first, then Vite build)
yarn build

# Run ESLint with TypeScript support
yarn lint

# Preview production build locally
yarn preview
```

## High-Level Architecture

### Technology Stack
- **React 18.2** with TypeScript (strict mode enabled)
- **Vite 5.2** for build tooling with Babel-based Fast Refresh
- **Tailwind CSS** + SCSS for styling
- **Radix UI/Shadcn** component library for accessible UI primitives
- **React Router DOM v6** for client-side routing
- **React Hook Form + Zod** for forms and validation
- **Axios** for API communication with Square backend
- **Google Tag Manager** (GTM-W94TJ64) via vite-plugin-radar for analytics
- **EmailJS** for contact form functionality
- **Framer Motion** and **React Spring** for animations
- **date-fns**, **dayjs**, **moment-timezone** for date/time handling

### Project Structure

```
src/
├── components/
│   ├── analytics/        # PageTracker for route-based analytics
│   ├── book/            # 4-step booking flow components (BookList, BookAppointment, BookContactInfo, ThankYou)
│   ├── hamburger/       # Mobile navigation menu components
│   ├── landing/         # Shared landing page layout and components (header, footer, carousel)
│   ├── ui/              # Shadcn/Radix UI components (calendar, button, form, dialog, etc.)
│   ├── web/             # Main website components (header, footer, gallery carousel, Instagram section)
│   └── react-svg/       # SVG components (logo)
├── pages/
│   ├── landing/         # Individual barber landing pages (11 barbers: Josh, Wyatt, Rayhan, Jay, Niko, Emman, Dejan, Christos, Anthony, Noah, Amir)
│   └── web/             # Main site pages (Home, Barbers, Gallery, AboutUs, Careers, Contacts, PrivacyPolicy, NotFound)
├── utils/               # API clients and helper functions
├── hooks/               # Custom hooks for GTM, event tracking, UTM tracking
├── interfaces/          # TypeScript interfaces (BookingInterface, CustomerInterface, EventInterface, UserInterface)
└── constants/           # Event constants and localStorage key definitions
```

### Critical Routing Architecture

The routing system in `routes.tsx` uses a **duplicated route pattern** to support both normal and `/meta` prefixed URLs for analytics tracking purposes. Key patterns:

1. **Barber Landing Pages**: 11 individual barbers with routes like `/{barber-name}` and `/meta/{barber-name}`
2. **Barber-Specific Booking Flows**: Each barber has their own complete booking flow:
   - `/{barber-name}/book/services` → Service selection
   - `/{barber-name}/book/appointment` → Date/time selection
   - `/{barber-name}/book/contact-info` → Customer information
   - `/{barber-name}/book/thank-you` → Confirmation page
3. **General Booking Flow**: Accessible via `/book/*` routes (not barber-specific)
4. **Meta Route Duplication**: Every route is duplicated with `/meta` prefix for tracking purposes

**Important**: All route arrays (landingRoutes, bookRoutes, appointmentRoutes, contactInfoRoutes, ThankYouRoutes, webRoutes, metaWebRoutes) are mapped twice - once for normal path, once for `/meta` path.

### API Integration Architecture

Two separate API clients exist in `utils/`:

1. **apiSquare** (`apiClients.ts`): Primary API for Square integration
   - Base URL: `VITE_API_WEB_BASE_URL`
   - Auth: `x-api-key` header with `VITE_API_KEY_SQUARE`
   - Used by `barberApi.ts` for all Square operations

2. **api** (`newApi.ts`): Secondary API for customer records
   - Base URL: `VITE_NEW_API`
   - No authentication headers
   - Functions: `registerCustomer()`, `checkCustomerExists()`
   - Marked as TODO: deprecated

**barberApi.ts exports**:
- `getAllService()` - Get services filtered by type
- `getAllBarber()` - Get all barber team members
- `getBarberDetail()` - Get specific barber details
- `getAvailability()` - Check appointment availability
- `postCustomer()` - Create Square customer
- `postBooking()` - Create Square booking with source tracking
- `getCustomerStatusByEmailAndPhone()` - Check customer status
- `getCustomerByEmailAndPhone()` - Get customer details
- `postUtmRecord()` - Track UTM parameters

### Analytics & Tracking

1. **Google Tag Manager**: Configured in `vite.config.ts` with enableDev: true (GTM-W94TJ64)
2. **PageTracker Component**: Mounted in router to track route changes
3. **UTM Parameter Tracking**: Custom hooks capture and store UTM params in localStorage
4. **Event Tracking**: `eventTracker.ts` and `useEventTracking.tsx` for custom events
5. **Source Tracking**: Booking API includes `?source=` query parameter to track booking origin

### State Management & Data Flow

- **Local Storage Keys**: Defined in `constants/localStorageKey.constants.ts`
- **Barber Context**: Barber ID stored in localStorage (`barber_id`) to track booking source
- **UTM Parameters**: Persisted in localStorage for attribution tracking
- **Booking Flow State**: Passed via React Router navigation state between booking steps
- **Theme State**: Managed by ThemeProvider with localStorage persistence (`vite-ui-theme`)

### Environment Configuration

Required environment variables:
- `VITE_API_WEB_BASE_URL`: Primary backend API URL for Square integration
- `VITE_API_KEY_SQUARE`: Square API authentication key
- `VITE_SQUARE_LOCATION_ID`: Square location identifier for bookings
- `VITE_BASE_URL_MINIO`: MinIO object storage URL for assets
- `VITE_NEW_API`: Secondary API base URL (deprecated customer registration system)
- `VITE_MAINTENANCE_MODE`: Enable/disable maintenance mode (`true`/`false`)

### Maintenance Mode

The application supports a maintenance mode feature to display a branded maintenance page to visitors during system updates or scheduled downtime.

**Configuration:**
- Set `VITE_MAINTENANCE_MODE=true` in `.env` file to enable maintenance mode
- Set `VITE_MAINTENANCE_MODE=false` to disable (default)
- Requires rebuild and redeployment to toggle

**Behavior:**
- When enabled, all routes redirect to `/maintenance` page
- Whitelisted routes remain accessible: `/admin`, `/dashboard`, `/maintenance`
- Maintenance page includes branded design matching existing theme (dark background, #33FF00 accent)
- SEO meta tags set to `noindex, nofollow` during maintenance

**Implementation:**
- `MaintenanceGuard` component (`src/components/MaintenanceGuard.tsx`) wraps all routes
- Maintenance page component at `src/pages/web/Maintenance.tsx`
- Route guard checks `import.meta.env.VITE_MAINTENANCE_MODE` value
- TypeScript types defined in `src/vite-env.d.ts`

### Build and Deployment

- **Build Process**: TypeScript compilation followed by Vite bundling
- **Docker Image**: Multi-stage build (Node 20 → Nginx Alpine)
  - Stage 1: npm install & build (creates `dist/`)
  - Stage 2: Nginx serves static files from `dist/`
  - Custom nginx.conf configuration
  - Image name: `aldovadev/barber-web:latest`
- **Path Aliasing**: `@/` → `src/` (configured in both tsconfig.json and vite.config.ts)
- **Chunk Size Limit**: Increased to 1600KB in vite.config.ts to accommodate large bundles

### Key Implementation Details

1. **Barber Image Mapping**: Static imports in BookList.tsx map barber names (uppercase) to image assets
2. **Type Safety**: Strict TypeScript mode enabled with noUnusedLocals and noUnusedParameters
3. **Form Validation**: Zod schemas with React Hook Form resolver pattern
4. **Responsive Design**: react-responsive for device detection, Tailwind for styling
5. **Carousels**: Embla Carousel with custom arrow buttons and wheel gesture support