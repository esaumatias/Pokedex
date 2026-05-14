import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { PreferencesProvider } from '@/context/PreferencesContext';
import { queryClient } from '@/lib/queryClient';

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PreferencesProvider>{children}</PreferencesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
