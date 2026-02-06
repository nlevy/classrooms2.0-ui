import { useState } from 'react';
import { StudentGrid } from '../components/student-grid/StudentGrid';
import { FileImportDialog } from '../components/file-import/FileImportDialog';
import { AssignmentPanel } from '../components/assignment/AssignmentPanel';

export function DataEntryPage() {
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StudentGrid onImport={() => setImportOpen(true)} />
      <AssignmentPanel />
      <FileImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
