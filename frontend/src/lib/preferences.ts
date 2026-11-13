import type { PreferencesLoadResult, UserPreferences } from './types';
import { PREFERENCES_TEXT } from './strings';

const PREFERENCES_STORAGE_KEY = 'org-starter.user-preferences';
const PREFERENCES_STORAGE_VERSION = 1;

const DEFAULT_USER_PREFERENCES: Readonly<UserPreferences> = {
  theme: 'light',
  inAppNotificationsIndicator: false,
  emailNotificationsIndicator: false,
};

function validatePreferences(value: unknown): value is UserPreferences {
  return (
    typeof value === 'object' &&
    value !== null &&
    'theme' in value &&
    (value.theme === 'light' || value.theme === 'dark') &&
    'inAppNotificationsIndicator' in value &&
    typeof value.inAppNotificationsIndicator === 'boolean' &&
    'emailNotificationsIndicator' in value &&
    typeof value.emailNotificationsIndicator === 'boolean'
  );
}

export function loadPreferences(): PreferencesLoadResult {
  let storedValue: string | null;

  try {
    storedValue = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
  } catch {
    return {
      preferences: { ...DEFAULT_USER_PREFERENCES },
      errorMessage: PREFERENCES_TEXT.loadError,
    };
  }

  if (storedValue === null) {
    return { preferences: { ...DEFAULT_USER_PREFERENCES }, errorMessage: '' };
  }

  let storedPreferences: unknown;

  try {
    storedPreferences = JSON.parse(storedValue);
  } catch {
    return {
      preferences: { ...DEFAULT_USER_PREFERENCES },
      errorMessage: PREFERENCES_TEXT.invalidStorageError,
    };
  }

  if (
    typeof storedPreferences !== 'object' ||
    storedPreferences === null ||
    !('version' in storedPreferences) ||
    storedPreferences.version !== PREFERENCES_STORAGE_VERSION ||
    !validatePreferences(storedPreferences)
  ) {
    return {
      preferences: { ...DEFAULT_USER_PREFERENCES },
      errorMessage: PREFERENCES_TEXT.invalidStorageError,
    };
  }

  return {
    preferences: {
      theme: storedPreferences.theme,
      inAppNotificationsIndicator: storedPreferences.inAppNotificationsIndicator,
      emailNotificationsIndicator: storedPreferences.emailNotificationsIndicator,
    },
    errorMessage: '',
  };
}

export function savePreferences(preferences: UserPreferences): void {
  if (!validatePreferences(preferences)) {
    throw new Error(PREFERENCES_TEXT.invalidPreferencesError);
  }

  window.localStorage.setItem(
    PREFERENCES_STORAGE_KEY,
    JSON.stringify({
      version: PREFERENCES_STORAGE_VERSION,
      theme: preferences.theme,
      inAppNotificationsIndicator: preferences.inAppNotificationsIndicator,
      emailNotificationsIndicator: preferences.emailNotificationsIndicator,
    })
  );
}
