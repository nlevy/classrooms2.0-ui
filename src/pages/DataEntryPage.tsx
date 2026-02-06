import { useTranslation } from 'react-i18next';

export function DataEntryPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <p className="text-lg text-gray-500">
        {t('appTitle')} — Data Entry (Phase 2)
      </p>
    </div>
  );
}
