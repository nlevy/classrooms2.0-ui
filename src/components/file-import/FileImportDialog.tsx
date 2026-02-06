import { useState, useCallback, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/index.ts';
import { useFileParser } from './useFileParser.ts';

interface FileImportDialogProps {
  open: boolean;
  onClose: () => void;
}

const ACCEPTED_EXTENSIONS = '.csv,.xlsx,.xls';

export function FileImportDialog({ open, onClose }: FileImportDialogProps) {
  const { t } = useTranslation();
  const setStudents = useStore((s) => s.setStudents);
  const { parsedStudents, error, isLoading, parseFile, reset } = useFileParser();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
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

  const handleConfirm = useCallback(() => {
    if (parsedStudents.length > 0) {
      setStudents(parsedStudents);
      handleClose();
    }
  }, [parsedStudents, setStudents]);

  const handleClose = useCallback(() => {
    reset();
    setFileName(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }, [onClose, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
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
            className="mb-3 h-10 w-10 text-gray-400"
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

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={parsedStudents.length === 0 || isLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('confirmImport')}
          </button>
        </div>
      </div>
    </div>
  );
}
