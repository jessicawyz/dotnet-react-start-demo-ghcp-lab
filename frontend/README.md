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
- `npm test -- --runInBand` - Run Jest and React Testing Library tests
- `npm test -- --runInBand --coverage` - Run tests with coverage
- `npm run preview` - Preview production build

## Save Your Preferences

1. Open **Preferences** in the application navigation.
2. Select **Light** or **Dark** and independently enable or disable **In-app
   notifications** and **Email notifications**.
3. Select **Save preferences**. The saved theme applies across the application,
   and a confirmation appears.
4. Reload the page to restore your saved settings.

Select **Cancel** to discard unsaved changes. Navigating away also discards
unsaved changes. Save and Cancel are disabled when nothing has changed.

### Defaults and Storage

| Setting | Default |
| --- | --- |
| Display theme | Light |
| In-app notifications | Off |
| Email notifications | Off |

Preferences are stored in browser `localStorage` under
`org-starter.user-preferences`, using schema version `1`. Saving preferences does
not call the backend.

Settings are specific to the browser profile and site origin, not to an
authenticated account. They do not synchronize across browsers or devices.
People sharing a browser profile share these preferences. A different hostname
or port has separate storage. Clearing site data removes saved preferences.

Notification controls save preferences only. Email delivery, in-app notification
delivery, and browser push permissions are not implemented.

### Recover from Storage Errors

- If saved data is invalid or has an unsupported version, the application shows
  a warning and uses the defaults. Change and save your preferences to replace
  the invalid entry.
- If storage cannot be read, the application shows a warning and uses the
  defaults. Check browser settings that block site storage.
- If saving fails, the application shows an error and keeps the previously
  committed settings and theme. Enable site storage or free storage space, then
  retry saving.
- To reset preferences, remove only the `org-starter.user-preferences` entry
  using the browser's developer tools and reload the page.

## Preferences Tests

Jest and React Testing Library cover storage validation and failures, saving and
cancelling changes, independent notification toggles, navigation, and restoration
after remounting. These DOM-based tests do not replace visual browser checks.
