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
      navigate('/');
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
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-4 py-2">
        <button
          onClick={() => navigate('/')}
          className="rounded bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          {t('backToData')}
        </button>
        <button
          onClick={() => exportAssignmentCsv(classes, summaries)}
          className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
        >
          {t('exportCsv')}
        </button>
        <button
          onClick={handleReset}
          className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
        >
          {t('resetOriginal')}
        </button>
        <button
          onClick={handleRerun}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t('rerun')}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 overflow-y-auto p-4 lg:flex-[3]">
          <ClassCardGrid />
        </div>
        <div className="min-h-0 overflow-y-auto border-s border-gray-200 bg-white p-4 lg:flex-[2]">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
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
