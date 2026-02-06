import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { PageLayout } from './components/common/PageLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DataEntryPage } from './pages/DataEntryPage';
import { useStore } from './store';

const ResultsPage = lazy(() =>
  import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage })),
);

export default function App() {
  const language = useStore((s) => s.language);

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <BrowserRouter>
      <PageLayout>
        <ErrorBoundary>
          <Suspense fallback={<div className="flex flex-1 items-center justify-center text-gray-400">Loading...</div>}>
            <Routes>
              <Route path="/" element={<DataEntryPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </PageLayout>
    </BrowserRouter>
  );
}
