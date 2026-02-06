import { useErrorTranslation } from '../../hooks/useErrorTranslation';
import { useStore } from '../../store';

export function ErrorAlert() {
  const error = useStore((s) => s.error);
  const setError = useStore((s) => s.setError);
  const translateError = useErrorTranslation();

  if (!error) return null;

  return (
    <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <span className="text-red-600 text-lg">!</span>
      <div className="flex-1">
        <p className="text-sm text-red-800">{translateError(error)}</p>
      </div>
      <button
        onClick={() => setError(null)}
        className="text-red-400 hover:text-red-600"
        aria-label="Dismiss error"
      >
        x
      </button>
    </div>
  );
}
