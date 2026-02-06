import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/index.ts';
import { recalculateSummaries } from '../../utils/summary-calculator.ts';
import { ClassCard } from './ClassCard.tsx';
import { EmptyState } from '../common/EmptyState.tsx';

export function ClassCardGrid() {
  const { t } = useTranslation('results');
  const { t: tCommon } = useTranslation();
  const classes = useStore((s) => s.classes);
  const moveStudent = useStore((s) => s.moveStudent);
  const setSummaries = useStore((s) => s.setSummaries);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !active.data.current) return;

    const studentName = String(active.id);
    const fromClass = String(active.data.current.classId);
    const toClass = String(over.id);

    if (fromClass === toClass) return;

    moveStudent(studentName, fromClass, toClass);

    const updatedClasses = useStore.getState().classes;
    if (updatedClasses) {
      setSummaries(recalculateSummaries(updatedClasses));
    }
  }

  if (!classes || Object.keys(classes).length === 0) {
    return <EmptyState title={tCommon('emptyResultsTitle')} subtitle={tCommon('emptyResultsSubtitle')} />;
  }

  const sortedEntries = Object.entries(classes).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 italic">{t('dragHint')}</p>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedEntries.map(([classId, students]) => (
            <ClassCard
              key={classId}
              classId={classId}
              students={students}
              allClasses={classes}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
