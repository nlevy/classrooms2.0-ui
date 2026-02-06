import type { StateCreator } from 'zustand';
import type { ApiError } from '../types/api';

export type View = 'data-entry' | 'results';

export interface UiSlice {
  language: string;
  view: View;
  isLoading: boolean;
  error: ApiError | null;
  classCount: number;
  setLanguage: (language: string) => void;
  setView: (view: View) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ApiError | null) => void;
  setClassCount: (count: number) => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  language: localStorage.getItem('language') || 'en',
  view: 'data-entry',
  isLoading: false,
  error: null,
  classCount: 3,
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    set({ language });
  },
  setView: (view) => set({ view }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setClassCount: (count) => set({ classCount: count }),
});
