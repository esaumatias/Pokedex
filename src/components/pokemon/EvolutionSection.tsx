import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Skeleton } from '@/components/ui/Skeleton';
import { flattenEvolutionChain } from '@/lib/pokemon-utils';
import { cn } from '@/lib/cn';
import { extractIdFromPokemonUrl, getPokemon, type EvolutionChain, type Pokemon } from '@/services/pokeapi';

type Props = {
  chain: EvolutionChain;
  activeName: string;
  className?: string;
};

function artworkOf(p: Pokemon) {
  return (
    p.sprites.other?.['official-artwork']?.front_default ??
    p.sprites.other?.home?.front_default ??
    p.sprites.front_default ??
    ''
  );
}

export function EvolutionSection({ chain, activeName, className }: Props) {
  const rows = flattenEvolutionChain(chain.chain);
  const names = Array.from(new Set(rows.flat().map((s) => s.name)));

  const spriteMap = useQueries({
    queries: names.map((name) => ({
      queryKey: ['pokemon', name] as const,
      queryFn: () => getPokemon(name),
      staleTime: 1000 * 60 * 10,
    })),
    combine: (qs) => {
      const map = new Map<string, string>();
      qs.forEach((q, i) => {
        const name = names[i];
        if (q.data && name) map.set(name, artworkOf(q.data));
      });
      return map;
    },
  });

  return (
    <section className={cn('rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md', className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[color:var(--color-muted)]">Evoluções</h2>
          <p className="text-xs text-[color:var(--color-muted)]">Linhas evolutivas e requisitos principais</p>
        </div>
      </div>

      <div className="mt-5 space-y-8">
        {rows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex flex-wrap items-center gap-3">
            {row.map((step, i) => {
              const img = spriteMap.get(step.name);
              const id = extractIdFromPokemonUrl(step.url);
              const active = step.name === activeName;
              const next = row[i + 1];

              return (
                <Fragment key={`${step.name}-${i}`}>
                  <motion.div layout className={cn('relative', active && 'drop-shadow-[0_0_18px_oklch(0.72_0.2_275/0.45)]')}>
                    <Link
                      to={`/pokemon/${step.name}`}
                      className={cn(
                        'group flex w-[132px] flex-col items-center rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 p-3 transition hover:border-[color:var(--color-accent)]/40',
                        active && 'border-[color:var(--color-accent)]/55',
                      )}
                    >
                      <div className="relative aspect-square w-full">
                        {img ? (
                          <img src={img} alt="" className="h-full w-full object-contain transition group-hover:scale-[1.05]" loading="lazy" />
                        ) : (
                          <Skeleton className="h-full w-full" />
                        )}
                      </div>
                      <p className="mt-2 w-full truncate text-center text-xs font-semibold capitalize text-[color:var(--color-fg)]">
                        {step.name.replaceAll('-', ' ')}
                      </p>
                      <p className="font-mono text-[10px] text-[color:var(--color-muted)]">#{String(id).padStart(4, '0')}</p>
                    </Link>
                  </motion.div>

                  {next ? (
                    <div className="flex flex-col items-center gap-1 px-1 text-[color:var(--color-muted)]">
                      <span className="text-lg">→</span>
                      {next.minLevel ? (
                        <span className="rounded-full bg-[color:var(--color-border)]/60 px-2 py-0.5 text-[10px] font-medium">Nv. {next.minLevel}</span>
                      ) : (
                        <span className="text-[10px]">evolui</span>
                      )}
                    </div>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
