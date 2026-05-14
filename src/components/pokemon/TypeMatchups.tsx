import { useQueries } from '@tanstack/react-query';
import { memo, useMemo } from 'react';

import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { cn } from '@/lib/cn';
import { getType } from '@/services/pokeapi';

type Props = {
  typeNames: string[];
  className?: string;
};

export const TypeMatchups = memo(function TypeMatchups({ typeNames, className }: Props) {
  const unique = useMemo(() => Array.from(new Set(typeNames.map((t) => t.toLowerCase()))), [typeNames]);

  const data = useQueries({
    queries: unique.map((name) => ({
      queryKey: ['type', name] as const,
      queryFn: () => getType(name),
      staleTime: 1000 * 60 * 60,
    })),
    combine: (qs) => {
      const weak = new Map<string, number>();
      const resist = new Map<string, number>();
      const immune = new Set<string>();

      qs.forEach((q) => {
        if (!q.data) return;
        for (const t of q.data.damage_relations.double_damage_from) {
          weak.set(t.name, (weak.get(t.name) ?? 0) + 1);
        }
        for (const t of q.data.damage_relations.half_damage_from) {
          resist.set(t.name, (resist.get(t.name) ?? 0) + 1);
        }
        for (const t of q.data.damage_relations.no_damage_from) {
          immune.add(t.name);
        }
      });

      const weakList = [...weak.entries()]
        .filter(([name]) => !immune.has(name))
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, stacks]) => ({ name, stacks }));

      const resistList = [...resist.entries()]
        .filter(([name]) => !immune.has(name))
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, stacks]) => ({ name, stacks }));

      const immuneList = [...immune].sort((a, b) => a.localeCompare(b));

      return { weakList, resistList, immuneList, pending: qs.some((q) => q.isPending), error: qs.some((q) => q.isError) };
    },
  });

  return (
    <section className={cn('rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-[color:var(--color-muted)]">Matchups</h2>
          <p className="text-xs text-[color:var(--color-muted)]">Fraquezas, resistências e imunidades (combinação de tipos)</p>
        </div>
        {data.pending ? <span className="text-xs text-[color:var(--color-muted)]">Calculando…</span> : null}
      </div>

      {data.error ? (
        <p className="mt-3 text-sm text-[color:var(--color-muted)]">Não foi possível carregar os tipos para matchups.</p>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Fraquezas</p>
            <div className="flex flex-wrap gap-2">
              {data.weakList.length === 0 ? (
                <span className="text-xs text-[color:var(--color-muted)]">Nenhuma fraqueza típica.</span>
              ) : (
                data.weakList.map((t) => (
                  <span key={t.name} className="inline-flex items-center gap-2">
                    <TypeBadge type={t.name} />
                    {t.stacks > 1 ? (
                      <span className="rounded-full bg-[color:var(--color-border)]/60 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-fg)]">
                        ×{t.stacks}
                      </span>
                    ) : null}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Resistências</p>
            <div className="flex flex-wrap gap-2">
              {data.resistList.length === 0 ? (
                <span className="text-xs text-[color:var(--color-muted)]">Sem resistências destacadas.</span>
              ) : (
                data.resistList.map((t) => (
                  <span key={t.name} className="inline-flex items-center gap-2">
                    <TypeBadge type={t.name} />
                    {t.stacks > 1 ? (
                      <span className="rounded-full bg-[color:var(--color-border)]/60 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-fg)]">
                        ×{t.stacks}
                      </span>
                    ) : null}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Imunidades</p>
            <div className="flex flex-wrap gap-2">
              {data.immuneList.length === 0 ? (
                <span className="text-xs text-[color:var(--color-muted)]">Sem imunidades.</span>
              ) : (
                data.immuneList.map((t) => <TypeBadge key={t} type={t} />)
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});
