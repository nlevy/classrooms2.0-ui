import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { Student } from '../../types/student';
import { Grade } from '../../types/student';

interface PerformanceChartProps {
  classes: Record<string, Student[]>;
  type: 'academic' | 'behavioral';
}

export default function PerformanceChart({ classes, type }: PerformanceChartProps) {
  const { t } = useTranslation('results');

  const data = useMemo(() => {
    return Object.entries(classes).map(([className, students]) => {
      const field = type === 'academic' ? 'academicPerformance' : 'behavioralPerformance';
      return {
        className: `${t('class')} ${className}`,
        [Grade.LOW]: students.filter((s) => s[field] === Grade.LOW).length,
        [Grade.MEDIUM]: students.filter((s) => s[field] === Grade.MEDIUM).length,
        [Grade.HIGH]: students.filter((s) => s[field] === Grade.HIGH).length,
      };
    });
  }, [classes, type, t]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="className" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey={Grade.LOW} name={t('low')} stackId="performance" fill="#EF4444" />
        <Bar dataKey={Grade.MEDIUM} name={t('medium')} stackId="performance" fill="#EAB308" />
        <Bar dataKey={Grade.HIGH} name={t('high')} stackId="performance" fill="#22C55E" />
      </BarChart>
    </ResponsiveContainer>
  );
}
