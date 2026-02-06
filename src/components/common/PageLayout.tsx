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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">{t('appTitle')}</h1>
        <LanguageToggle />
      </header>
      <ErrorAlert />
      <main className="flex-1">{children}</main>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
