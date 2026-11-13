/**
 * Animated loading indicator for async operations.
 * Displays a spinning visual cue while data is being fetched.
 */
export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12" role="status" aria-label="Loading content">
      <div
        className="w-12 h-12 border-4 border-[var(--color-brand-primary)] border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="mt-4 text-[var(--color-brand-text)] font-medium">
        Loading data...
      </span>
    </div>
  );
}
