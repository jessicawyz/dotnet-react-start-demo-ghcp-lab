import { loadPreferences, savePreferences } from './preferences';
import { PREFERENCES_TEXT } from './strings';
import type { UserPreferences } from './types';

const storageKey = 'org-starter.user-preferences';
const defaults: UserPreferences = {
  theme: 'light',
  inAppNotificationsIndicator: false,
  emailNotificationsIndicator: false,
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('browser-local preferences', () => {
  test('loadPreferences_MissingStorage_ReturnsLightAndNotificationsOffWithoutError', () => {
    // Arrange
    const getItem = jest.spyOn(Storage.prototype, 'getItem');
    const setItem = jest.spyOn(Storage.prototype, 'setItem');

    // Act
    const result = loadPreferences();

    // Assert
    expect(result).toEqual({ preferences: defaults, errorMessage: '' });
    expect(getItem).toHaveBeenCalledWith(storageKey);
    expect(setItem).not.toHaveBeenCalled();
  });

  test.each([
    ['malformed JSON', '{'],
    ['null', 'null'],
    ['primitive', 'true'],
    ['array', '[]'],
    ['missing version', JSON.stringify(defaults)],
    ['unsupported version', JSON.stringify({ ...defaults, version: 2 })],
    ['string version', JSON.stringify({ ...defaults, version: '1' })],
    ['invalid theme', JSON.stringify({ ...defaults, version: 1, theme: 'system' })],
    ['missing in-app flag', JSON.stringify({ version: 1, theme: 'light', emailNotificationsIndicator: false })],
    ['non-boolean in-app flag', JSON.stringify({ ...defaults, version: 1, inAppNotificationsIndicator: 'false' })],
    ['missing email flag', JSON.stringify({ version: 1, theme: 'light', inAppNotificationsIndicator: false })],
    ['non-boolean email flag', JSON.stringify({ ...defaults, version: 1, emailNotificationsIndicator: 0 })],
  ])('loadPreferences_%s_ReturnsDefaultsAndCorruptionFeedbackWithoutOverwriting', (_scenario, storedValue) => {
    // Arrange
    window.localStorage.setItem(storageKey, storedValue);

    // Act
    const result = loadPreferences();

    // Assert
    expect(result).toEqual({
      preferences: defaults,
      errorMessage: PREFERENCES_TEXT.invalidStorageError,
    });
    expect(window.localStorage.getItem(storageKey)).toBe(storedValue);
  });

  test('loadPreferences_BlockedRead_ReturnsDefaultsAndLoadFeedback', () => {
    // Arrange
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });

    // Act
    const result = loadPreferences();

    // Assert
    expect(result).toEqual({
      preferences: defaults,
      errorMessage: PREFERENCES_TEXT.loadError,
    });
  });

  test.each([
    [true, false],
    [false, true],
    [true, true],
    [false, false],
  ])('savePreferences_InApp%sEmail%s_RoundTripsIndependentFlagsInVersionedStorage', (inApp, email) => {
    // Arrange
    const preferences: UserPreferences = {
      theme: 'dark',
      inAppNotificationsIndicator: inApp,
      emailNotificationsIndicator: email,
    };

    // Act
    savePreferences(preferences);
    const restored = loadPreferences();

    // Assert
    expect(JSON.parse(window.localStorage.getItem(storageKey)!)).toEqual({
      version: 1,
      ...preferences,
    });
    expect(restored).toEqual({ preferences, errorMessage: '' });
  });

  test('savePreferences_InvalidRuntimeInput_RejectsWithoutWriting', () => {
    // Arrange
    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    const invalid = { ...defaults, theme: 'system' } as unknown as UserPreferences;

    // Act / Assert
    expect(() => savePreferences(invalid)).toThrow(PREFERENCES_TEXT.invalidPreferencesError);
    expect(setItem).not.toHaveBeenCalled();
  });

  test('savePreferences_BlockedWrite_ThrowsAndPreservesPreviousCommit', () => {
    // Arrange
    savePreferences(defaults);
    const priorStorage = window.localStorage.getItem(storageKey);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError');
    });

    // Act / Assert
    expect(() => savePreferences({ ...defaults, theme: 'dark' })).toThrow(DOMException);
    expect(window.localStorage.getItem(storageKey)).toBe(priorStorage);
    expect(loadPreferences().preferences).toEqual(defaults);
  });
});
