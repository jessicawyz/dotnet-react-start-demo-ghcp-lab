interface ErrorDisplayProps {
  errorTitle?: string;
  errorDescription: string;
}

/**
 * Displays error messages with organization brand styling.
 * Used for API failures and validation errors.
 */
export function ErrorMessage({ errorTitle, errorDescription }: ErrorDisplayProps) {
  return (
    <div
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
      role="alert"
      aria-live="assertive"
    >
      {errorTitle && (
        <h3 className="text-red-800 font-semibold mb-1">{errorTitle}</h3>
      )}
      <p className="text-red-700">{errorDescription}</p>
    </div>
  );
}
