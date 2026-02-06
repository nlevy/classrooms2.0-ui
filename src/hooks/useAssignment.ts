import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/index.ts';
import { assignStudents } from '../api/classrooms-api.ts';
import { ApiRequestError } from '../api/client.ts';
import type { ApiError } from '../types/api.ts';
import { recalculateSummaries } from '../utils/summary-calculator.ts';

export function useAssignment() {
  const students = useStore((s) => s.students);
  const classCount = useStore((s) => s.classCount);
  const setLoading = useStore((s) => s.setLoading);
  const setError = useStore((s) => s.setError);
  const setAssignmentResult = useStore((s) => s.setAssignmentResult);
  const navigate = useNavigate();

  const assign = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assignStudents(students, classCount);
      setAssignmentResult(response.classes, recalculateSummaries(response.classes));
      navigate('/results');
    } catch (err: unknown) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError);
      } else {
        const fallback: ApiError = {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            params: {},
            message: 'An unexpected error occurred',
          },
        };
        setError(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  return { assign };
}
