# Classroom Assignment

A web application for optimally assigning students to balanced classes. It uses a constraint-based algorithm that considers gender balance, friend preferences, separation constraints, and academic/behavioral scores.

## Features

- **Smart Assignment** — algorithm-based balanced class assignment considering multiple constraints
- **Drag & Drop** — reassign students between classes interactively after the algorithm runs
- **Data Grid** — AG Grid-powered spreadsheet for entering and editing student data
- **File Import** — import student data from CSV/Excel files
- **Export Results** — download class assignments as an Excel file
- **Statistics** — visual charts and summary tables for assignment quality
- **Bilingual** — full English and Hebrew (RTL) support

## Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS 4
- AG Grid (data entry)
- dnd-kit (drag & drop)
- Recharts (charts)
- Zustand (state management)
- React Router, React Hook Form, Zod
- i18next (internationalization)

## Getting Started

```bash
npm install
npm run dev
```

### Backend Configuration

The app calls the backend API at endpoints `/classrooms` and `/template`.

**Development** — Vite proxies API requests to the backend. The default target is `http://localhost:5000`. To change it, set `API_TARGET` before starting the dev server:

```bash
export API_TARGET=http://localhost:5000
npm run dev
```

**Production** — Set the `VITE_API_BASE_URL` env variable at build time to point to the backend:

```bash
export VITE_API_BASE_URL=https://api.example.com 
npm run build
```

If not set, API calls use relative URLs (useful when a reverse proxy forwards requests to the backend on the same origin).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── api/          # API client and service calls
├── components/   # Reusable UI components
│   ├── common/   # Layout, error boundary, language toggle
│   ├── data-entry/ # Grid, import dialog
│   └── results/  # Class cards, summary table, charts
├── hooks/        # Custom React hooks
├── i18n/         # Internationalization (en, he)
├── pages/        # Route-level page components
├── store/        # Zustand store slices
├── types/        # TypeScript type definitions
└── utils/        # Utility functions (export, calculations)
```
