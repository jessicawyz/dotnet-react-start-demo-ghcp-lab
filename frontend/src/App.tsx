import { useLayoutEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { SystemHealthPage } from './routes/health/HealthPage';
import { PreferencesPage } from './routes/preferences/PreferencesPage';
import { ErrorMessage } from './components/ErrorMessage';
import { loadPreferences, savePreferences } from './lib/preferences';
import { PREFERENCES_TEXT } from './lib/strings';
import type { UserPreferences } from './lib/types';

/**
 * Main application shell with routing and navigation.
 */
export function ApplicationShell() {
  const [preferencesState, setPreferencesState] = useState(loadPreferences);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = preferencesState.preferences.theme;
  }, [preferencesState.preferences.theme]);

  function handleSavePreferences(preferences: UserPreferences) {
    savePreferences(preferences);
    setPreferencesState({ preferences, errorMessage: '' });
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="bg-[var(--color-brand-header)] px-6 py-4 shadow-md">
          <nav className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-between">
            <h1 className="text-white text-xl font-bold tracking-tight">
              Organization Starter
            </h1>
            <ul className="flex flex-wrap gap-6">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/preferences"
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  {PREFERENCES_TEXT.title}
                </Link>
              </li>
              <li>
                <Link
                  to="/health"
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  System Health
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
          {preferencesState.errorMessage && (
            <div className="mb-6">
              <ErrorMessage errorDescription={preferencesState.errorMessage} />
            </div>
          )}
          <Routes>
            <Route path="/" element={<WelcomeLanding />} />
            <Route path="/health" element={<SystemHealthPage />} />
            <Route
              path="/preferences"
              element={
                <PreferencesPage
                  preferences={preferencesState.preferences}
                  onSave={handleSavePreferences}
                />
              }
            />
          </Routes>
        </main>

        <footer className="bg-[var(--color-brand-subtle)] px-6 py-4 text-center text-sm text-[var(--color-brand-muted)]">
          <p>Organization Starter Template &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

/** Landing page component */
function WelcomeLanding() {
  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold text-[var(--color-brand-text)] mb-4">
        Welcome to the Starter Template
      </h2>
      <p className="text-lg text-[var(--color-brand-muted)] mb-8 max-w-2xl mx-auto">
        This application demonstrates the organization development standards
        with a .NET 8 backend and React 18 frontend.
      </p>
      <Link
        to="/health"
        className="inline-block bg-[var(--color-brand-primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Check System Health
      </Link>
    </div>
  );
}
