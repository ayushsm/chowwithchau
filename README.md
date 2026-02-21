# Chow with Chau - Baking Order System

A React + TypeScript web application for customers to place baking orders and admins to manage them.

## Features

### Customer Features
- Clean, intuitive order form
- Simple description-based ordering
- Success confirmation after order submission

### Admin Features
- Secure login system
- View all customer orders
- See order details and timestamps
- Sign out functionality

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Backend**: Supabase (Database + Authentication)
- **Styling**: Custom CSS with brand colors

## Brand Colors

See [BRAND_COLORS.md](./BRAND_COLORS.md) for the full color palette.

- Sage Green: `#7E8C69`, `#9CAD8C`
- Pink: `#F6B0BB`, `#F1C8CB`
- Cream: `#ECE0DA`

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Follow instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create `.env` file with your Supabase credentials

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Routes

- `/` - Customer order page (public)
- `/login` - Admin login
- `/admin` - Admin dashboard (protected)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── OrderModal.tsx
│   ├── SuccessMessage.tsx
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Admin.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/                # Utilities
│   └── supabase.ts
└── App.tsx             # Main app with routing
```

## Development

The app uses Vite for fast hot-module replacement during development. Changes to components and styles will update instantly in the browser.
