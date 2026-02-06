import type { ApiError } from '../types/api';

export class ApiRequestError extends Error {
  readonly status: number;
  readonly apiError: ApiError;

  constructor(status: number, apiError: ApiError) {
    super(apiError.error.message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.apiError = apiError;
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ApiError;
    throw new ApiRequestError(response.status, errorBody);
  }

  return response.json() as Promise<T>;
}
