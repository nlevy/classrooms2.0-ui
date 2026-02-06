import { useTranslation } from 'react-i18next';
import type { Student } from '../../types/student';
import type { ClassSummary } from '../../types/assignment';
import GenderChart from './GenderChart';
import PerformanceChart from './PerformanceChart';
import BalanceRadar from './BalanceRadar';

interface StatisticsChartsProps {
  classes: Record<string, Student[]>;
  summaries: ClassSummary[];
}

export default function StatisticsCharts({ classes, summaries }: StatisticsChartsProps) {
  const { t } = useTranslation('results');

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">{t('genderBalance')}</h3>
        <GenderChart classes={classes} />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">
          {t('performanceDistribution')} — {t('academicPerformance')}
        </h3>
        <PerformanceChart classes={classes} type="academic" />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">
          {t('performanceDistribution')} — {t('behavioralPerformance')}
        </h3>
        <PerformanceChart classes={classes} type="behavioral" />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">{t('overallBalance')}</h3>
        <BalanceRadar summaries={summaries} />
      </section>
    </div>
  );
}
