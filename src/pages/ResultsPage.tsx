import { useTranslation } from 'react-i18next';

export function ResultsPage() {
  const { t } = useTranslation('results');

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <p className="text-lg text-gray-500">
        {t('resultsTitle')} (Phase 5)
      </p>
    </div>
  );
}
