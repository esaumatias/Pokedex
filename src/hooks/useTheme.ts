import { useCallback, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

function getSystemDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme(storageKey: string) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    return 'system';
  });

  const resolved = useMemo(() => (mode === 'system' ? (getSystemDark() ? 'dark' : 'light') : mode), [mode]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, mode);
  }, [mode, storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
  }, [resolved]);

  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const dark = mq.matches;
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setTheme = useCallback((next: ThemeMode) => setMode(next), []);

  return { mode, setTheme, resolved } as const;
}
