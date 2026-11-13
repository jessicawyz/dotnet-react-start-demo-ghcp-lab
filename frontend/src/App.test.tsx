import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationShell } from './App';
import { executeApiRequest } from './lib/api';
import { PREFERENCES_TEXT } from './lib/strings';

// Preferences must remain browser-local; isolate the unrelated Vite API module.
jest.mock('./lib/api', () => ({ executeApiRequest: jest.fn() }));

const storageKey = 'org-starter.user-preferences';
const saveButton = () => screen.getByRole('button', { name: PREFERENCES_TEXT.save });
const cancelButton = () => screen.getByRole('button', { name: PREFERENCES_TEXT.cancel });
const lightRadio = () => screen.getByRole('radio', { name: PREFERENCES_TEXT.lightTheme });
const darkRadio = () => screen.getByRole('radio', { name: PREFERENCES_TEXT.darkTheme });
const inAppCheckbox = () => screen.getByRole('checkbox', { name: PREFERENCES_TEXT.inAppNotifications });
const emailCheckbox = () => screen.getByRole('checkbox', { name: PREFERENCES_TEXT.emailNotifications });

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '/preferences');
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  expect(executeApiRequest).not.toHaveBeenCalled();
});

describe('preferences workflow', () => {
  test('Preferences_UnchangedOrCancelledDraft_DoesNotWriteOrApplyTheme', async () => {
    // Arrange
    const user = userEvent.setup();
    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    render(<ApplicationShell />);
    expect(lightRadio()).toBeChecked();
    expect(inAppCheckbox()).not.toBeChecked();
    expect(emailCheckbox()).not.toBeChecked();
    expect(saveButton()).toBeDisabled();

    // Act
    await user.click(darkRadio());
    await user.click(inAppCheckbox());
    await user.click(emailCheckbox());

    // Assert
    expect(saveButton()).toBeEnabled();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(setItem).not.toHaveBeenCalled();

    // Act
    await user.click(cancelButton());

    // Assert
    expect(lightRadio()).toBeChecked();
    expect(inAppCheckbox()).not.toBeChecked();
    expect(emailCheckbox()).not.toBeChecked();
    expect(saveButton()).toBeDisabled();
    expect(setItem).not.toHaveBeenCalled();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  test.each([
    [PREFERENCES_TEXT.inAppNotifications, 'inAppNotificationsIndicator', 'emailNotificationsIndicator'],
    [PREFERENCES_TEXT.emailNotifications, 'emailNotificationsIndicator', 'inAppNotificationsIndicator'],
  ])('Preferences_Save%s_CommitsOnlySelectedNotificationAndRestoresAfterNavigationAndRemount', async (label, selectedFlag, otherFlag) => {
    // Arrange
    const user = userEvent.setup();
    const { unmount } = render(<ApplicationShell />);

    // Act
    await user.click(darkRadio());
    await user.click(screen.getByRole('checkbox', { name: label }));
    await user.click(saveButton());

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent(PREFERENCES_TEXT.saved);
    expect(saveButton()).toBeDisabled();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(JSON.parse(window.localStorage.getItem(storageKey)!)).toEqual({
      version: 1,
      theme: 'dark',
      [selectedFlag]: true,
      [otherFlag]: false,
    });

    // Act: abandon unsaved changes by navigating away.
    await user.click(lightRadio());
    await user.click(screen.getByRole('checkbox', { name: label }));
    await user.click(screen.getByRole('link', { name: 'Home' }));
    await user.click(screen.getByRole('link', { name: PREFERENCES_TEXT.title }));

    // Assert
    expect(darkRadio()).toBeChecked();
    expect(screen.getByRole('checkbox', { name: label })).toBeChecked();
    expect(saveButton()).toBeDisabled();

    // Act: simulate a reload with a new application instance and cleared DOM theme.
    unmount();
    delete document.documentElement.dataset.theme;
    window.history.replaceState({}, '', '/');
    render(<ApplicationShell />);

    // Assert
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('heading', { name: 'Welcome to the Starter Template' })).toBeVisible();

    // Act
    await user.click(screen.getByRole('link', { name: PREFERENCES_TEXT.title }));

    // Assert
    expect(darkRadio()).toBeChecked();
    expect(screen.getByRole('checkbox', { name: label })).toBeChecked();
    expect(screen.getByRole('checkbox', {
      name: label === PREFERENCES_TEXT.inAppNotifications
        ? PREFERENCES_TEXT.emailNotifications
        : PREFERENCES_TEXT.inAppNotifications,
    })).not.toBeChecked();
    expect(saveButton()).toBeDisabled();
  });

  test('Preferences_RevertedDraft_DisablesSaveWithoutWriting', async () => {
    // Arrange
    const user = userEvent.setup();
    const setItem = jest.spyOn(Storage.prototype, 'setItem');
    render(<ApplicationShell />);

    // Act
    await user.click(emailCheckbox());
    await user.click(emailCheckbox());
    await user.click(darkRadio());
    await user.click(lightRadio());

    // Assert
    expect(saveButton()).toBeDisabled();
    expect(cancelButton()).toBeDisabled();
    expect(setItem).not.toHaveBeenCalled();
  });

  test.each(['corrupt', 'blocked'] as const)(
    'ApplicationMount_%sStorage_ShowsFeedbackAndCanRecoverWithExplicitSave',
    async (scenario) => {
      // Arrange
      const user = userEvent.setup();
      window.localStorage.setItem(storageKey, '{');
      const getItem = jest.spyOn(Storage.prototype, 'getItem');
      if (scenario === 'blocked') {
        getItem.mockImplementation(() => {
          throw new DOMException('Storage blocked', 'SecurityError');
        });
      }
      render(<ApplicationShell />);
      expect(screen.getByRole('alert')).toHaveTextContent(
        scenario === 'blocked' ? PREFERENCES_TEXT.loadError : PREFERENCES_TEXT.invalidStorageError
      );
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(lightRadio()).toBeChecked();
      expect(inAppCheckbox()).not.toBeChecked();
      expect(emailCheckbox()).not.toBeChecked();
      getItem.mockRestore();

      // Act
      await user.click(darkRadio());
      await user.click(saveButton());

      // Assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent(PREFERENCES_TEXT.saved);
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(JSON.parse(window.localStorage.getItem(storageKey)!)).toMatchObject({
        version: 1,
        theme: 'dark',
      });
    }
  );

  test('Preferences_FailedSave_PreservesCommittedDarkThemeAndFlagsUntilSuccessfulRetry', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ApplicationShell />);
    await user.click(darkRadio());
    await user.click(inAppCheckbox());
    await user.click(saveButton());
    const priorStorage = window.localStorage.getItem(storageKey);
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError');
    });

    // Act
    await user.click(lightRadio());
    await user.click(inAppCheckbox());
    await user.click(emailCheckbox());
    await user.click(saveButton());

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent(PREFERENCES_TEXT.saveError);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(saveButton()).toBeEnabled();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(storageKey)).toBe(priorStorage);
    expect(lightRadio()).toBeChecked();
    expect(emailCheckbox()).toBeChecked();

    // Act
    await user.click(cancelButton());

    // Assert
    expect(darkRadio()).toBeChecked();
    expect(inAppCheckbox()).toBeChecked();
    expect(emailCheckbox()).not.toBeChecked();
    expect(saveButton()).toBeDisabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // Act
    setItem.mockRestore();
    await user.click(lightRadio());
    await user.click(saveButton());

    // Assert
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('status')).toHaveTextContent(PREFERENCES_TEXT.saved);
  });
});
