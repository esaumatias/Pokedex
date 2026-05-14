import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import { PageLoader } from '@/components/ui/PageLoader';
import { HomePage } from '@/pages/HomePage';

const PokemonDetailPage = lazy(() =>
  import('@/pages/PokemonDetailPage').then((m) => ({ default: m.PokemonDetailPage })),
);
const ComparePage = lazy(() => import('@/pages/ComparePage').then((m) => ({ default: m.ComparePage })));

export function AppRouter() {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
