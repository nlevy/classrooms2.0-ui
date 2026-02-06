import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const setLanguage = useStore((s) => s.setLanguage);

  const toggle = () => {
    const next = i18n.language === 'en' ? 'he' : 'en';
    i18n.changeLanguage(next);
    setLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      {i18n.language === 'en' ? 'עברית' : 'English'}
    </button>
  );
}
