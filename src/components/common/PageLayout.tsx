import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { useStore } from '../../store';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { t } = useTranslation();
  const isLoading = useStore((s) => s.isLoading);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <header dir="ltr" className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 shadow-md sm:px-6">
        <h1 className="text-lg font-bold text-white sm:text-xl">{t('appTitle')}</h1>
        <LanguageToggle />
      </header>
      <ErrorAlert />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
