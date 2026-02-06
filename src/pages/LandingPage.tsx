import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../components/common/LanguageToggle';

export function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    { title: t('featureSmartTitle'), desc: t('featureSmartDesc'), icon: '🧠' },
    { title: t('featureDragTitle'), desc: t('featureDragDesc'), icon: '🖱️' },
    { title: t('featureExportTitle'), desc: t('featureExportDesc'), icon: '📊' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header dir="ltr" className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 shadow-md sm:px-6">
        <h1 className="text-lg font-bold text-white sm:text-xl">{t('appTitle')}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/about')}
            className="rounded-lg border border-white/30 bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            {t('about')}
          </button>
          <LanguageToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
            {t('appTitle')}
          </h2>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl">
            {t('landingTagline')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
            >
              {t('getStarted')}
            </button>
            <button
              onClick={() => navigate('/about')}
              className="rounded-lg border-2 border-blue-600 px-6 py-3 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              {t('learnMore')}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-gray-800">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
