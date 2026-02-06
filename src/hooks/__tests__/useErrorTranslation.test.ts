import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

import { useTranslation } from 'react-i18next';
import { useErrorTranslation } from '../useErrorTranslation';
import type { ApiError } from '../../types/api';

describe('useErrorTranslation', () => {
  const mockT = vi.fn();

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useTranslation).mockReturnValue({ t: mockT, i18n: {}, ready: true } as any);
    mockT.mockReset();
  });

  it('translates error code using errors namespace', () => {
    mockT.mockReturnValue('Student data is empty.');
    const translateError = useErrorTranslation();

    const apiError: ApiError = {
      error: {
        code: 'EMPTY_STUDENT_DATA',
        params: {},
        message: 'raw message',
      },
    };

    const result = translateError(apiError);

    expect(useTranslation).toHaveBeenCalledWith('errors');
    expect(mockT).toHaveBeenCalledWith('EMPTY_STUDENT_DATA', {});
    expect(result).toBe('Student data is empty.');
  });

  it('passes params to translation function', () => {
    mockT.mockReturnValue("Duplicate names: Alice, Bob");
    const translateError = useErrorTranslation();

    const apiError: ApiError = {
      error: {
        code: 'DUPLICATE_STUDENT_NAMES',
        params: { duplicates: 'Alice, Bob' },
        message: 'raw',
      },
    };

    translateError(apiError);

    expect(mockT).toHaveBeenCalledWith('DUPLICATE_STUDENT_NAMES', { duplicates: 'Alice, Bob' });
  });

  it('handles unknown error codes gracefully', () => {
    mockT.mockReturnValue('UNKNOWN_CODE');
    const translateError = useErrorTranslation();

    const apiError: ApiError = {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        params: {},
        message: 'something broke',
      },
    };

    const result = translateError(apiError);
    expect(mockT).toHaveBeenCalledWith('INTERNAL_SERVER_ERROR', {});
    expect(result).toBe('UNKNOWN_CODE');
  });
});
