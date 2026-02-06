import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { ClassCardGrid } from '../components/results/ClassCardGrid';
import { SummaryTable } from '../components/results/SummaryTable';
import StatisticsCharts from '../components/results/StatisticsCharts';
import { assignStudents } from '../api/classrooms-api';
import { ApiRequestError } from '../api/client';
import { exportAssignmentCsv } from '../utils/csv-export';
import { recalculateSummaries } from '../utils/summary-calculator';

export function ResultsPage() {
  const { t } = useTranslation();
  const { t: tResults } = useTranslation('results');
  const navigate = useNavigate();

  const classes = useStore((s) => s.classes);
  const summaries = useStore((s) => s.summaries);
  const resetToOriginal = useStore((s) => s.resetToOriginal);
  const setSummaries = useStore((s) => s.setSummaries);
  const students = useStore((s) => s.students);
  const classCount = useStore((s) => s.classCount);
  const setLoading = useStore((s) => s.setLoading);
  const setError = useStore((s) => s.setError);
  const setAssignmentResult = useStore((s) => s.setAssignmentResult);

  useEffect(() => {
    if (!classes || !summaries) {
      navigate('/app');
    }
  }, [classes, summaries, navigate]);

  if (!classes || !summaries) {
    return null;
  }

  const handleReset = () => {
    resetToOriginal();
    const original = useStore.getState().classes;
    if (original) {
      setSummaries(recalculateSummaries(original));
    }
  };

  const handleRerun = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assignStudents(students, classCount);
      setAssignmentResult(response.classes, response.summaries);
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
        <button
          onClick={() => navigate('/app')}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t('backToData')}
        </button>
        <button
          onClick={() => exportAssignmentCsv(classes, summaries)}
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          {t('exportCsv')}
        </button>
        <button
          onClick={handleReset}
          className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
        >
          {t('resetOriginal')}
        </button>
        <button
          onClick={handleRerun}
          className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow"
        >
          {t('rerun')}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 overflow-y-auto p-4 lg:flex-[4]">
          <ClassCardGrid />
        </div>
        <div className="min-h-0 overflow-y-auto border-s border-gray-200 bg-slate-50 p-4 lg:flex-[2]">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <span className="inline-block h-5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></span>
            {tResults('statistics')}
          </h2>
          <SummaryTable summaries={summaries} />
          <div className="mt-6">
            <StatisticsCharts classes={classes} summaries={summaries} />
          </div>
        </div>
      </div>
    </div>
  );
}
