import { useTranslation } from 'react-i18next';
import type { ApiError } from '../types/api';

export function useErrorTranslation() {
  const { t } = useTranslation('errors');

  return function translateError(apiError: ApiError): string {
    const { code, params } = apiError.error;
    return t(code, params);
  };
}
