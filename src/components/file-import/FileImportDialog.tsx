import { useState, useCallback, useRef, useMemo } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/index.ts';
import { useFileParser } from './useFileParser.ts';
import type { Student } from '../../types/student.ts';

interface FileImportDialogProps {
  open: boolean;
  onClose: () => void;
}

const ACCEPTED_EXTENSIONS = '.csv,.xlsx,.xls';

function studentKey(s: Student): string {
  return `${s.name}\0${s.school}`;
}

function mergeStudents(existing: Student[], incoming: Student[]): Student[] {
  const merged = new Map<string, Student>();
  for (const s of existing) {
    merged.set(studentKey(s), s);
  }
  for (const s of incoming) {
    merged.set(studentKey(s), s);
  }
  return Array.from(merged.values());
}

export function FileImportDialog({ open, onClose }: FileImportDialogProps) {
  const { t } = useTranslation();
  const setStudents = useStore((s) => s.setStudents);
  const existingStudents = useStore((s) => s.students);
  const { parsedStudents, error, isLoading, parseFile, reset } = useFileParser();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const duplicateNames = useMemo(() => {
    if (existingStudents.length === 0 || parsedStudents.length === 0) return [];
    const existingKeys = new Set(existingStudents.map(studentKey));
    return parsedStudents
      .filter((s) => existingKeys.has(studentKey(s)))
      .map((s) => s.name);
  }, [existingStudents, parsedStudents]);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      setShowDuplicateWarning(false);
      parseFile(file);
    },
    [parseFile],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleReplace = useCallback(() => {
    if (parsedStudents.length > 0) {
      setStudents(parsedStudents);
      handleClose();
    }
  }, [parsedStudents, setStudents]);

  const handleAdd = useCallback(() => {
    if (parsedStudents.length === 0) return;

    if (duplicateNames.length > 0 && !showDuplicateWarning) {
      setShowDuplicateWarning(true);
      return;
    }

    setStudents(mergeStudents(existingStudents, parsedStudents));
    handleClose();
  }, [parsedStudents, existingStudents, duplicateNames, showDuplicateWarning, setStudents]);

  const handleClose = useCallback(() => {
    reset();
    setFileName(null);
    setIsDragging(false);
    setShowDuplicateWarning(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }, [onClose, reset]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}
    >
      <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
          <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></span>
          {t('importFile')}
        </h2>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <svg
            className="mb-3 h-10 w-10 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-1 text-sm text-gray-600">
            {t('dragDropFile')}
          </p>
          <p className="text-xs text-gray-400">CSV, XLSX, XLS</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {fileName && (
          <p className="mt-3 text-sm text-gray-600">
            {t('selectedFile')}: <span className="font-medium">{fileName}</span>
          </p>
        )}

        {isLoading && (
          <p className="mt-3 text-sm text-blue-600">{t('parsing')}</p>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        {parsedStudents.length > 0 && (
          <p className="mt-3 text-sm text-green-600">
            {parsedStudents.length} {t('studentsFound')}
          </p>
        )}

        {showDuplicateWarning && (
          <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3">
            <p className="text-sm font-medium text-amber-800">
              {t('duplicateWarning', { count: duplicateNames.length })}
            </p>
            <p className="mt-1 max-h-20 overflow-y-auto text-xs text-amber-700">
              {duplicateNames.join(', ')}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          {existingStudents.length > 0 && parsedStudents.length > 0 ? (
            <>
              <button
                onClick={handleAdd}
                disabled={isLoading}
                className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showDuplicateWarning ? t('confirmOverride') : t('addToExisting')}
              </button>
              <button
                onClick={handleReplace}
                disabled={isLoading}
                className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-300"
              >
                {t('replaceExisting')}
              </button>
            </>
          ) : (
            <button
              onClick={handleReplace}
              disabled={parsedStudents.length === 0 || isLoading}
              className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-300"
            >
              {t('confirmImport')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
