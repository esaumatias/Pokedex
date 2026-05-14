import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useTheme, type ThemeMode } from '@/hooks/useTheme';

const FAV_KEY = 'pokedex:favorites';
const HIST_KEY = 'pokedex:history';
const SOUND_KEY = 'pokedex:sound';
const THEME_KEY = 'pokedex:theme';
const MAX_HIST = 14;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type Preferences = {
  favoriteIds: number[];
  history: string[];
  soundEnabled: boolean;
};

type Ctx = Preferences & {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (m: ThemeMode) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  pushHistory: (name: string) => void;
  clearHistory: () => void;
  setSoundEnabled: (v: boolean) => void;
  playTap: () => void;
};

const PreferencesContext = createContext<Ctx | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { mode, setTheme, resolved } = useTheme(THEME_KEY);

  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => read(FAV_KEY, []));
  const [history, setHistory] = useState<string[]>(() => read(HIST_KEY, []));
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => read(SOUND_KEY, true));

  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    window.localStorage.setItem(FAV_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    window.localStorage.setItem(HIST_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem(SOUND_KEY, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === FAV_KEY) setFavoriteIds(JSON.parse(e.newValue) as number[]);
        if (e.key === HIST_KEY) setHistory(JSON.parse(e.newValue) as string[]);
        if (e.key === SOUND_KEY) setSoundEnabledState(JSON.parse(e.newValue) as boolean);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const favSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback((id: number) => favSet.has(id), [favSet]);

  const pushHistory = useCallback((name: string) => {
    const key = name.trim().toLowerCase();
    if (!key) return;
    setHistory((prev) => {
      const next = [key, ...prev.filter((n) => n !== key)];
      return next.slice(0, MAX_HIST);
    });
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const setSoundEnabled = useCallback((v: boolean) => setSoundEnabledState(v), []);

  const playTap = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AnyWin = window as unknown as { webkitAudioContext?: typeof AudioContext };
      const AudioCtx = window.AudioContext || AnyWin.webkitAudioContext;
      if (!AudioCtx) return;
      if (!ctxRef.current) ctxRef.current = new AudioCtx();
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {
      /* ignore */
    }
  }, [soundEnabled]);

  const value = useMemo<Ctx>(
    () => ({
      favoriteIds,
      history,
      soundEnabled,
      themeMode: mode,
      resolvedTheme: resolved,
      setThemeMode: setTheme,
      toggleFavorite,
      isFavorite,
      pushHistory,
      clearHistory,
      setSoundEnabled,
      playTap,
    }),
    [
      favoriteIds,
      history,
      soundEnabled,
      mode,
      resolved,
      setTheme,
      toggleFavorite,
      isFavorite,
      pushHistory,
      clearHistory,
      setSoundEnabled,
      playTap,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences deve estar dentro de PreferencesProvider');
  return ctx;
}
