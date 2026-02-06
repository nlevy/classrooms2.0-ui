import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { PageLayout } from './components/common/PageLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DataEntryPage } from './pages/DataEntryPage';
import { useStore } from './store';

const ResultsPage = lazy(() =>
  import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage })),
);

const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })),
);

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);

export default function App() {
  const language = useStore((s) => s.language);

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex flex-1 items-center justify-center text-gray-400">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/app"
              element={
                <PageLayout>
                  <DataEntryPage />
                </PageLayout>
              }
            />
            <Route
              path="/results"
              element={
                <PageLayout>
                  <ResultsPage />
                </PageLayout>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
