import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { PageLayout } from './components/common/PageLayout';
import { DataEntryPage } from './pages/DataEntryPage';
import { ResultsPage } from './pages/ResultsPage';
import { useStore } from './store';

export default function App() {
  const language = useStore((s) => s.language);

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<DataEntryPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}
