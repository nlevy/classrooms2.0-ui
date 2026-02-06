import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Student } from '../../types/student.ts';
import { detectHebrewHeaders, mapRowToStudent } from '../../utils/column-mapping.ts';

interface UseFileParserReturn {
  parsedStudents: Student[];
  error: string | null;
  isLoading: boolean;
  parseFile: (file: File) => void;
  reset: () => void;
}

function parseRows(rows: Record<string, string>[]): Student[] {
  if (rows.length === 0) return [];
  const headers = Object.keys(rows[0]);
  const isHebrew = detectHebrewHeaders(headers);
  return rows.map((row) => mapRowToStudent(row, isHebrew));
}

export function useFileParser(): UseFileParserReturn {
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reset = useCallback(() => {
    setParsedStudents([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const parseCsv = useCallback((file: File) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const students = parseRows(results.data);
          setParsedStudents(students);
        } catch {
          setError('Failed to parse CSV file');
        }
        setIsLoading(false);
      },
      error: () => {
        setError('Failed to read CSV file');
        setIsLoading(false);
      },
    });
  }, []);

  const parseExcel = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
          defval: '',
          raw: false,
        });
        const students = parseRows(rows);
        setParsedStudents(students);
      } catch {
        setError('Failed to parse Excel file');
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError('Failed to read Excel file');
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const parseFile = useCallback(
    (file: File) => {
      setError(null);
      setParsedStudents([]);
      setIsLoading(true);

      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'csv') {
        parseCsv(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        parseExcel(file);
      } else {
        setError('Unsupported file format. Please use CSV or Excel files.');
        setIsLoading(false);
      }
    },
    [parseCsv, parseExcel],
  );

  return { parsedStudents, error, isLoading, parseFile, reset };
}
