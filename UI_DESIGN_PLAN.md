# Classrooms UI - Design Plan

## Context

The classrooms assignment backend (Python/Flask) has no UI — teachers currently have no way to interact with it beyond raw API calls. The goal is to build a modern React + TypeScript frontend as a **separate repository** that lets teachers enter student data in a familiar spreadsheet-like interface, run the assignment algorithm, visualize results with charts and class cards, and fine-tune assignments via drag-and-drop.

---

## Tech Stack

| Concern | Library | Why |
|---------|---------|-----|
| Framework | **React 18 + TypeScript 5** | User preference, strong typing |
| Build | **Vite** | Fast HMR, simple config |
| Data grid | **AG Grid Community** | Best Excel-like UX, built-in RTL, clipboard paste, cell editing |
| Drag-and-drop | **@dnd-kit/core + sortable** | Modern, accessible, maintained (unlike react-beautiful-dnd) |
| Charts | **Recharts** | React-native, declarative JSX API, lightweight |
| i18n | **react-i18next** | `{{param}}` interpolation matches backend error pattern |
| State | **Zustand** | Minimal boilerplate, TypeScript-first, localStorage persistence middleware |
| Styling | **Tailwind CSS 4** | Logical properties for RTL (`ms-`/`me-` instead of `ml-`/`mr-`), rapid dev |
| File parsing | **Papa Parse** (CSV) + **SheetJS** (Excel) | Definitive libraries for each format |
| Routing | **React Router v7** | Standard, only 2 routes needed |
| Forms | **React Hook Form + Zod** | For settings/class count input |
| HTTP | **fetch wrapper** (typed) | Only 2 API endpoints, no need for axios |
| Testing | **Vitest + React Testing Library + Playwright** | Unit + e2e |

---

## Project Structure (separate repo: `classrooms-ui/`)

```
src/
  api/
    client.ts                     # Typed fetch wrapper with error handling
    classrooms-api.ts             # assignStudents(), getTemplate()
    types.ts                      # API request/response TS types
  components/
    common/
      LanguageToggle.tsx           # EN/HE switch
      ErrorAlert.tsx               # Translated error display
      LoadingSpinner.tsx
      PageLayout.tsx               # Header, language toggle, RTL wrapper
    student-grid/
      StudentGrid.tsx              # AG Grid wrapper
      StudentGrid.columns.ts      # Column defs (en + he headers)
      CellEditors.tsx              # Dropdown editors for gender, performance
      GridToolbar.tsx              # Import/export/add/delete buttons
      useStudentGrid.ts            # Grid state hook
    file-import/
      FileImportDialog.tsx         # Drag-drop upload modal
      ColumnMapper.tsx             # Manual column mapping fallback
      useFileParser.ts             # CSV/Excel parse + Hebrew detection
      column-mappings.ts           # Hebrew<->English column/enum maps
    assignment/
      AssignmentPanel.tsx          # Class count input + Assign button
      AssignmentProgress.tsx       # Loading overlay
    results/
      ResultsView.tsx              # Main results container
      ClassCard.tsx                # Single class: header + student list
      ClassCardGrid.tsx            # Grid of cards with DnD zones
      StudentChip.tsx              # Draggable student tag
      SummaryTable.tsx             # Side-by-side class comparison
      StatisticsCharts.tsx         # Charts container
      GenderChart.tsx              # Males/females per class (grouped bar)
      PerformanceChart.tsx         # LOW/MED/HIGH distribution (stacked bar)
      BalanceRadar.tsx             # Overall quality radar chart
      useClassDragDrop.ts          # DnD logic + summary recalculation
  i18n/
    index.ts                       # i18next config
    locales/
      en/ common.json, grid.json, results.json, errors.json
      he/ common.json, grid.json, results.json, errors.json
  hooks/
    useAssignment.ts               # Full assign flow orchestration
    useErrorTranslation.ts         # API error code -> translated message
    useLocalStorage.ts
  store/
    index.ts                       # Zustand store
    student-slice.ts               # Student list CRUD
    assignment-slice.ts            # Results, drag-drop state, move history
    ui-slice.ts                    # Language, view, loading, errors
  types/
    student.ts                     # Student, Gender, Grade types
    assignment.ts                  # AssignmentResponse, ClassSummary
    api.ts                         # ApiError type
  utils/
    column-mapping.ts              # Hebrew/English column + enum mapping
    summary-calculator.ts          # Client-side summary recalc after DnD
    csv-export.ts                  # Export results
    validation.ts                  # Pre-API client-side checks
  pages/
    DataEntryPage.tsx              # Grid + import + assign trigger
    ResultsPage.tsx                # Cards + DnD + charts
  App.tsx
  main.tsx
```

---

## Two Main Screens

### Screen 1: Data Entry

- **Header**: App title + EN/HE toggle
- **Toolbar**: [Import File] [Add Row] [Delete Selected] | "42 students"
- **Grid**: AG Grid filling viewport, all 12 student columns, Excel-like editing
  - Friend columns: autocomplete from current student names
  - Gender/performance columns: dropdown selectors
  - Paste from Excel works natively
  - Red highlights on invalid cells
  - Data persists to localStorage
- **Bottom bar**: [Number of classes: ___] [Assign to Classes]

### Screen 2: Results

- **Left panel (60%)**: Class cards in a responsive grid
  - Each card: class header + student chips (draggable)
  - Drop zone highlights when dragging over
  - Warning badges for friendless students or not-with violations
- **Right panel (40%)**: Statistics
  - Summary table (all classes side-by-side)
  - Gender balance chart (grouped bar)
  - Academic + behavioral performance charts (stacked bars)
  - Balance radar chart
- **Top toolbar**: [Back to Data] [Export CSV] [Reset to Original] [Re-run]
- Charts and summaries update live when a student is dragged between classes

---

## Key Data Flows

### CSV/Excel Import

File dropped -> Papa Parse or SheetJS -> detect Hebrew/English headers -> auto-map columns (or show manual mapper) -> convert Hebrew enums (ז->MALE, א->LOW) -> populate grid

### Assignment

Grid data -> client-side validation -> POST /classrooms?classesNumber=N -> on success: store results, navigate to results -> on error: translate error code via i18next, highlight offending row

### Drag-and-Drop Reassignment

Drag student chip between class cards -> update assignment slice -> client-side summary recalculation (mirrors backend `summary_service.py` logic) -> update charts + table -> show warnings for new constraint violations -> undo support via move history stack

---

## i18n / RTL Strategy

- `document.dir` toggles `rtl`/`ltr` on language switch
- Tailwind logical properties (`ms-`, `me-`, `ps-`, `pe-`) handle spacing automatically
- AG Grid: `enableRtl={lang === 'he'}` prop
- Error translations: copy backend's `client_examples/i18n/errors-*.json`, convert `{param}` to `{{param}}` for i18next
- Hebrew column mapping for file import derived from `src/data/template-he.json`

---

## Implementation Phases

### Phase 1: Scaffold + Infrastructure

Vite project, Tailwind, React Router, i18next setup, Zustand store skeleton, PageLayout with language toggle, RTL switching, API client module, error translation hook.

### Phase 2: Student Data Grid

AG Grid with all 12 columns, cell editors (dropdowns for enums, autocomplete for friends), grid toolbar (add/delete row), localStorage persistence, column headers switch with language.

### Phase 3: File Import

FileImportDialog with drag-drop, Papa Parse + SheetJS parsing, Hebrew column auto-detection and mapping, enum value conversion, preview table before import.

### Phase 4: Assignment API Integration

AssignmentPanel (class count + button), useAssignment hook (validate -> call -> store), loading state, full error handling for all 18 error codes, row highlighting for student-specific errors.

### Phase 5: Results Display

ResultsPage layout, ClassCard with student list, StudentChip, SummaryTable, export to CSV.

### Phase 6: Drag-and-Drop

@dnd-kit integration, draggable StudentChips, droppable ClassCards, client-side summary recalculation, constraint violation warnings, undo/reset support.

### Phase 7: Charts

Recharts: GenderChart, PerformanceChart (academic + behavioral), BalanceRadar. Live updates on DnD changes.

### Phase 8: Polish

Responsive layout, keyboard accessibility, error boundaries, empty states, build optimization, Vitest unit tests, Playwright e2e test for critical path.

---

## Backend Files to Reference During Implementation

- `src/server/dto.py` — TS types must mirror `StudentDto`, `ClassSummaryDto` exactly (note: `averageBehaviouralPerformance` British spelling)
- `client_examples/i18n/errors-en.json` + `errors-he.json` — copy into frontend i18n
- `src/data/template-he.json` — Hebrew column names + enum values for import mapping
- `src/server/app.py` — API contracts (routes, params, response format)
- `src/service/summary_service.py` — logic to replicate client-side for DnD recalculation

---

## Verification

1. Run backend locally (`python src/main.py`) on port 5000
2. Run frontend (`npm run dev`) — Vite dev server with proxy to backend
3. Test full flow: import sample.csv -> verify grid populated -> set 6 classes -> click Assign -> verify results display -> drag a student -> verify summaries update -> switch to Hebrew -> verify RTL layout
