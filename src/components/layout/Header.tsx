import { Link } from 'react-router-dom';

import { usePreferences } from '@/context/PreferencesContext';
import { cn } from '@/lib/cn';

type Props = {
  className?: string;
};

const pill =
  'inline-flex items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/50 px-3 py-2 text-xs font-semibold text-[color:var(--color-fg)] transition hover:border-[color:var(--color-accent)]/40';

export function Header({ className }: Props) {
  const { themeMode, setThemeMode, resolvedTheme, soundEnabled, setSoundEnabled } = usePreferences();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-[color:var(--color-border)]/70 bg-[color:var(--color-bg)]/70 backdrop-blur-xl',
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="group flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-2))] text-lg text-white shadow-lg shadow-black/10 transition group-hover:brightness-110">
            ⚡
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Pokédex</p>
            <p className="text-[11px] text-[color:var(--color-muted)]">Explore, favorite e compare</p>
          </div>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <Link to="/compare" className={pill}>
            Comparar
          </Link>

          <label className={cn(pill, 'gap-2 text-[color:var(--color-muted)]')}>
            <span className="hidden sm:inline">Tema</span>
            <select
              className="bg-transparent text-xs font-semibold text-[color:var(--color-fg)] outline-none"
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as typeof themeMode)}
              aria-label="Tema"
            >
              <option value="system">Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
            <span className="hidden text-[10px] uppercase tracking-wide text-[color:var(--color-muted)] md:inline">({resolvedTheme})</span>
          </label>

          <button
            type="button"
            className={pill}
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
          >
            {soundEnabled ? 'Som: on' : 'Som: off'}
          </button>
        </nav>
      </div>
    </header>
  );
}
