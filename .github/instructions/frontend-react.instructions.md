---
name: "Frontend React conventions"
description: "Conventions for the React + TypeScript + Tailwind frontend. Use when writing or reviewing code in frontend/."
applyTo: "frontend/**/*.{ts,tsx}"
---

# Frontend (React 18, TypeScript, Vite, Tailwind)

- One component per folder: `src/components/Name/Name.tsx` plus an `index.ts` re-export.
- TypeScript strict mode. Use `interface` for object shapes, `type` for unions. Shared types go in `src/lib/types.ts`.
- Call the API only through `fetchApi` in `src/lib/api.ts`. The base URL comes from `VITE_API_BASE_URL`.
- Style with Tailwind utility classes only. Use brand colors through the `--color-brand-*` CSS variables. Never hardcode hex values.
- Don't hardcode user-facing strings inline in components.
- Before finishing, run `npm run lint` and `npm run build` from `frontend/`.