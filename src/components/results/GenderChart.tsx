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
import { Gender } from '../../types/student';

interface GenderChartProps {
  classes: Record<string, Student[]>;
}

export default function GenderChart({ classes }: GenderChartProps) {
  const { t } = useTranslation('results');

  const data = useMemo(() => {
    return Object.entries(classes).map(([className, students]) => ({
      className: `${t('class')} ${className}`,
      males: students.filter((s) => s.gender === Gender.MALE).length,
      females: students.filter((s) => s.gender === Gender.FEMALE).length,
    }));
  }, [classes, t]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="className" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="males" name={t('males')} fill="#3B82F6" />
        <Bar dataKey="females" name={t('females')} fill="#EC4899" />
      </BarChart>
    </ResponsiveContainer>
  );
}
