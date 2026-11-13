import { useState } from 'react';
import type { FormEvent } from 'react';
import { ErrorMessage } from '../../components/ErrorMessage';
import { PREFERENCES_TEXT } from '../../lib/strings';
import type { UserPreferences } from '../../lib/types';

interface PreferencesPageProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export function PreferencesPage({ preferences, onSave }: PreferencesPageProps) {
  const [draftPreferences, setDraftPreferences] = useState<UserPreferences>(preferences);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const changedIndicator =
    draftPreferences.theme !== preferences.theme ||
    draftPreferences.inAppNotificationsIndicator !== preferences.inAppNotificationsIndicator ||
    draftPreferences.emailNotificationsIndicator !== preferences.emailNotificationsIndicator;

  function updateDraft(changes: Partial<UserPreferences>) {
    setDraftPreferences((currentPreferences) => ({ ...currentPreferences, ...changes }));
    setFeedbackMessage('');
    setErrorMessage('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!changedIndicator) {
      return;
    }

    try {
      onSave(draftPreferences);
    } catch {
      setErrorMessage(PREFERENCES_TEXT.saveError);
      setFeedbackMessage('');
      return;
    }

    setErrorMessage('');
    setFeedbackMessage(PREFERENCES_TEXT.saved);
  }

  function cancelChanges() {
    setDraftPreferences(preferences);
    setFeedbackMessage('');
    setErrorMessage('');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{PREFERENCES_TEXT.title}</h2>
        <p className="text-[var(--color-brand-muted)]">{PREFERENCES_TEXT.description}</p>
      </div>
      <p className="text-sm text-[var(--color-brand-muted)]">{PREFERENCES_TEXT.storageNotice}</p>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-brand-surface)] rounded-lg shadow-md p-6 space-y-6"
      >
        <fieldset className="space-y-3">
          <legend className="font-semibold mb-3">{PREFERENCES_TEXT.themeLegend}</legend>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={draftPreferences.theme === 'light'}
              onChange={() => updateDraft({ theme: 'light' })}
              className="accent-[var(--color-brand-primary)]"
            />
            {PREFERENCES_TEXT.lightTheme}
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={draftPreferences.theme === 'dark'}
              onChange={() => updateDraft({ theme: 'dark' })}
              className="accent-[var(--color-brand-primary)]"
            />
            {PREFERENCES_TEXT.darkTheme}
          </label>
        </fieldset>

        <fieldset className="space-y-3" aria-describedby="notifications-notice">
          <legend className="font-semibold mb-3">{PREFERENCES_TEXT.notificationsLegend}</legend>
          <p id="notifications-notice" className="text-sm text-[var(--color-brand-muted)]">
            {PREFERENCES_TEXT.notificationsNotice}
          </p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draftPreferences.inAppNotificationsIndicator}
              onChange={(event) =>
                updateDraft({ inAppNotificationsIndicator: event.target.checked })
              }
              className="accent-[var(--color-brand-primary)]"
            />
            {PREFERENCES_TEXT.inAppNotifications}
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draftPreferences.emailNotificationsIndicator}
              onChange={(event) =>
                updateDraft({ emailNotificationsIndicator: event.target.checked })
              }
              className="accent-[var(--color-brand-primary)]"
            />
            {PREFERENCES_TEXT.emailNotifications}
          </label>
        </fieldset>

        {errorMessage && <ErrorMessage errorDescription={errorMessage} />}
        <p role="status" aria-live="polite" className="text-sm">
          {feedbackMessage}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!changedIndicator}
            className="bg-[var(--color-brand-primary)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {PREFERENCES_TEXT.save}
          </button>
          <button
            type="button"
            onClick={cancelChanges}
            disabled={!changedIndicator}
            className="border border-[var(--color-brand-muted)] px-4 py-2 rounded-lg hover:bg-[var(--color-brand-subtle)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {PREFERENCES_TEXT.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
