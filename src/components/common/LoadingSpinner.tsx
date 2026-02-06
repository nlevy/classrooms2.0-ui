import { useTranslation } from 'react-i18next';

export function LoadingSpinner() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-8 shadow-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="text-sm text-gray-600">{t('loading')}</p>
      </div>
    </div>
  );
}
