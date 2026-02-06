import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { ClassSummary } from '../../types/assignment';

interface BalanceRadarProps {
  summaries: ClassSummary[];
}

const CLASS_COLORS = ['#3B82F6', '#EC4899', '#22C55E', '#EAB308', '#8B5CF6', '#F97316', '#06B6D4', '#F43F5E'];

export default function BalanceRadar({ summaries }: BalanceRadarProps) {
  const { t } = useTranslation('results');

  const metrics = useMemo(() => [
    { key: 'studentsCount', label: t('studentsCount') },
    { key: 'malesCount', label: t('malesCount') },
    { key: 'averageAcademicPerformance', label: t('averageAcademicPerformance') },
    { key: 'averageBehaviouralPerformance', label: t('averageBehaviouralPerformance') },
  ], [t]);

  const { data } = useMemo(() => {
    const maxVals: Record<string, number> = {};
    for (const metric of metrics) {
      const key = metric.key as keyof ClassSummary;
      maxVals[metric.key] = Math.max(...summaries.map((s) => s[key] as number), 1);
    }

    const chartData = metrics.map((metric) => {
      const key = metric.key as keyof ClassSummary;
      const entry: Record<string, string | number> = { metric: metric.label };
      for (const summary of summaries) {
        const raw = summary[key] as number;
        entry[`class_${summary.classNumber}`] = Math.round((raw / maxVals[metric.key]) * 100);
      }
      return entry;
    });

    return { data: chartData, maxValues: maxVals };
  }, [summaries, metrics]);

  if (summaries.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
        <Tooltip />
        <Legend />
        {summaries.map((summary, index) => (
          <Radar
            key={summary.classNumber}
            name={`${t('class')} ${summary.classNumber}`}
            dataKey={`class_${summary.classNumber}`}
            stroke={CLASS_COLORS[index % CLASS_COLORS.length]}
            fill={CLASS_COLORS[index % CLASS_COLORS.length]}
            fillOpacity={0.15}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
