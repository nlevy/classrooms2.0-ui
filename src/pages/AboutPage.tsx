import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../components/common/LanguageToggle';

export function AboutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    t('howToStep1'),
    t('howToStep2'),
    t('howToStep3'),
    t('howToStep4'),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header dir="ltr" className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 shadow-md sm:px-6">
        <button
          onClick={() => navigate('/')}
          className="text-lg font-bold text-white hover:underline sm:text-xl"
        >
          {t('appTitle')}
        </button>
        <LanguageToggle />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <section>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
            {t('howToUseTitle')}
          </h2>
          <ol className="mt-6 space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
            {t('aboutTitle')}
          </h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            {t('aboutDescription')}
          </p>
        </section>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/app')}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          >
            {t('getStarted')}
          </button>
        </div>
      </main>
    </div>
  );
}
