# Frontend Application

React 18 + TypeScript + Vite + Tailwind CSS frontend following organization standards.

## Getting Started

```bash
npm install
npm run dev
```

Application runs at `http://localhost:5173`.

## Project Layout

- `src/components/` - Reusable UI components
- `src/lib/` - Utilities, API client, types
- `src/routes/` - Page components
- `public/` - Static assets

## Environment Variables

Create `.env.local` for local development:

```
VITE_API_BASE_URL=http://localhost:5000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
