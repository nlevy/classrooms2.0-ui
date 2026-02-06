import { useTranslation } from 'react-i18next';
import type { ClassSummary } from '../../types/assignment.ts';

interface SummaryTableProps {
  summaries: ClassSummary[];
}

interface MetricRow {
  labelKey: string;
  getValue: (s: ClassSummary) => string | number;
  isWarning?: (s: ClassSummary) => boolean;
}

const metricRows: MetricRow[] = [
  { labelKey: 'studentsCount', getValue: (s) => s.studentsCount },
  { labelKey: 'malesCount', getValue: (s) => s.malesCount },
  { labelKey: 'averageAcademic', getValue: (s) => s.averageAcademicPerformance.toFixed(1) },
  { labelKey: 'averageBehavioural', getValue: (s) => s.averageBehaviouralPerformance.toFixed(1) },
  {
    labelKey: 'withoutFriends',
    getValue: (s) => s.withoutFriends,
    isWarning: (s) => s.withoutFriends > 0,
  },
  {
    labelKey: 'unwantedMatches',
    getValue: (s) => s.unwantedMatches,
    isWarning: (s) => s.unwantedMatches > 0,
  },
];

export function SummaryTable({ summaries }: SummaryTableProps) {
  const { t } = useTranslation('results');

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-indigo-600">
            <th className="px-4 py-2.5 text-start text-xs font-semibold uppercase tracking-wider text-white">
              {t('summary')}
            </th>
            {summaries.map((s) => (
              <th
                key={s.classNumber}
                className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white"
              >
                {t('class')} {s.classNumber}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metricRows.map((metric, rowIndex) => (
            <tr
              key={metric.labelKey}
              className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
            >
              <td className="border-t border-gray-100 px-4 py-2 text-start font-medium text-gray-700">
                {t(metric.labelKey)}
              </td>
              {summaries.map((s) => {
                const warn = metric.isWarning?.(s) ?? false;
                return (
                  <td
                    key={s.classNumber}
                    className={`border-t border-gray-100 px-4 py-2 text-center ${
                      warn ? 'bg-red-50 font-semibold text-red-600' : 'text-gray-800'
                    }`}
                  >
                    {metric.getValue(s)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
