import { motion } from 'framer-motion';

import { STAT_LABELS_PT } from '@/constants/pokemon';
import { cn } from '@/lib/cn';
import type { PokemonStat } from '@/services/pokeapi';

type Props = {
  stats: PokemonStat[];
  className?: string;
};

const MAX = 255;

const ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

export function StatBars({ stats, className }: Props) {
  const ordered = [...stats].sort((a, b) => ORDER.indexOf(a.stat.name) - ORDER.indexOf(b.stat.name));

  return (
    <div className={cn('grid gap-3', className)}>
      {ordered.map((s) => {
        const label = STAT_LABELS_PT[s.stat.name] ?? s.stat.name;
        const pct = Math.min(100, Math.round((s.base_stat / MAX) * 100));
        return (
          <div key={s.stat.name} className="grid gap-1">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-[color:var(--color-muted)]">{label}</span>
              <span className="font-mono text-sm text-[color:var(--color-fg)]">{s.base_stat}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--color-border)]/70">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2))]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
