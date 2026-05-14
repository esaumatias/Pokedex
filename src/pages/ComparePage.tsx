import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { StatBars } from '@/components/pokemon/StatBars';
import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePreferences } from '@/context/PreferencesContext';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { cn } from '@/lib/cn';
import { getPokemon } from '@/services/pokeapi';

function art(p: Awaited<ReturnType<typeof getPokemon>>) {
  return (
    p.sprites.other?.['official-artwork']?.front_default ??
    p.sprites.other?.home?.front_default ??
    p.sprites.front_default ??
    ''
  );
}

export function ComparePage() {
  useDocumentMeta({
    title: 'Comparar — Pokédex',
    description: 'Compare dois Pokémon lado a lado: stats, tipos e barras visuais.',
  });

  const [sp, setSp] = useSearchParams();
  const { favoriteIds } = usePreferences();

  const aRaw = sp.get('a') ?? '';
  const bRaw = sp.get('b') ?? '';
  const aName = aRaw.trim().toLowerCase();
  const bName = bRaw.trim().toLowerCase();

  const favMons = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ['pokemon', id] as const,
      queryFn: () => getPokemon(id),
      staleTime: 1000 * 60 * 10,
    })),
    combine: (qs) => qs.map((q) => q.data).filter((p): p is NonNullable<typeof p> => Boolean(p)),
  });

  const left = useQuery({
    queryKey: ['pokemon', aName] as const,
    queryFn: () => getPokemon(aName),
    enabled: aName.length > 0,
  });

  const right = useQuery({
    queryKey: ['pokemon', bName] as const,
    queryFn: () => getPokemon(bName),
    enabled: bName.length > 0,
  });

  const ready = left.isSuccess && right.isSuccess;

  const statCompare = useMemo(() => {
    if (!ready) return null;
    const A = left.data;
    const B = right.data;
    const mapA = new Map(A.stats.map((s) => [s.stat.name, s.base_stat]));
    const mapB = new Map(B.stats.map((s) => [s.stat.name, s.base_stat]));
    const keys = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();
    return keys.map((k) => ({ key: k, a: mapA.get(k) ?? 0, b: mapB.get(k) ?? 0 }));
  }, [left.data, right.data, ready]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Comparação</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">Escolha dois Pokémon e compare stats lado a lado.</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
          ← Voltar
        </Link>
      </div>

      <section className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md">
        <div className="grid gap-3 lg:grid-cols-2">
          <label className="grid gap-2 text-xs text-[color:var(--color-muted)]">
            Pokémon A
            <div className="flex flex-col gap-2">
              <Input
                value={aRaw}
                onChange={(e) => {
                  const next = new URLSearchParams(sp);
                  next.set('a', e.target.value);
                  setSp(next, { replace: true });
                }}
                placeholder="ex.: pikachu"
                aria-label="Pokémon A"
              />
              {favoriteIds.length > 0 ? (
                <select
                  className="h-11 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 px-3 text-sm font-medium text-[color:var(--color-fg)] outline-none"
                  value=""
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) return;
                    const next = new URLSearchParams(sp);
                    next.set('a', v);
                    setSp(next, { replace: true });
                    e.currentTarget.value = '';
                  }}
                  aria-label="Escolher Pokémon A dos favoritos"
                >
                  <option value="">Favoritos…</option>
                  {favMons.map((p) => (
                    <option key={p.id} value={p.name}>
                      #{String(p.id).padStart(4, '0')} — {p.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          </label>

          <label className="grid gap-2 text-xs text-[color:var(--color-muted)]">
            Pokémon B
            <div className="flex flex-col gap-2">
              <Input
                value={bRaw}
                onChange={(e) => {
                  const next = new URLSearchParams(sp);
                  next.set('b', e.target.value);
                  setSp(next, { replace: true });
                }}
                placeholder="ex.: bulbasaur"
                aria-label="Pokémon B"
              />
              {favoriteIds.length > 0 ? (
                <select
                  className="h-11 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 px-3 text-sm font-medium text-[color:var(--color-fg)] outline-none"
                  value=""
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) return;
                    const next = new URLSearchParams(sp);
                    next.set('b', v);
                    setSp(next, { replace: true });
                    e.currentTarget.value = '';
                  }}
                  aria-label="Escolher Pokémon B dos favoritos"
                >
                  <option value="">Favoritos…</option>
                  {favMons.map((p) => (
                    <option key={`b-${p.id}`} value={p.name}>
                      #{String(p.id).padStart(4, '0')} — {p.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-2xl"
            onClick={() => setSp(new URLSearchParams(), { replace: true })}
          >
            Limpar
          </Button>
        </div>
      </section>

      {!aName || !bName ? (
        <p className="text-sm text-[color:var(--color-muted)]">Preencha os dois campos para comparar.</p>
      ) : left.isPending || right.isPending ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[520px]" />
          <Skeleton className="h-[520px]" />
        </div>
      ) : left.isError || right.isError ? (
        <p className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/50 p-4 text-sm text-[color:var(--color-muted)]">
          Não foi possível carregar um dos Pokémon. Confira os nomes (em inglês, como na PokéAPI) e tente novamente.
        </p>
      ) : ready && left.data && right.data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[left.data, right.data].map((p, idx) => (
            <section
              key={p.id}
              className={cn(
                'rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md',
                idx === 0 && 'lg:border-[color:var(--color-accent)]/35',
                idx === 1 && 'lg:border-[color:var(--color-accent-2)]/35',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-[color:var(--color-muted)]">#{String(p.id).padStart(4, '0')}</p>
                  <h2 className="text-xl font-semibold capitalize">{p.name.replaceAll('-', ' ')}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.types
                      .slice()
                      .sort((x, y) => x.slot - y.slot)
                      .map((t) => (
                        <TypeBadge key={t.type.name} type={t.type.name} />
                      ))}
                  </div>
                </div>
                <Link className="text-xs font-semibold text-[color:var(--color-accent)] hover:underline" to={`/pokemon/${p.name}`}>
                  Ver ficha
                </Link>
              </div>

              <div className="relative mx-auto mt-4 aspect-square w-[min(100%,260px)]">
                {art(p) ? <img src={art(p)!} alt="" className="h-full w-full object-contain drop-shadow-xl" loading="lazy" /> : null}
              </div>

              <div className="mt-5">
                <StatBars stats={p.stats} />
              </div>
            </section>
          ))}

          <section className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-[color:var(--color-muted)]">Comparativo rápido</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {statCompare?.map((s) => {
                const max = Math.max(s.a, s.b, 1);
                return (
                  <div key={s.key} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/30 p-3">
                    <p className="text-xs font-semibold capitalize text-[color:var(--color-muted)]">{s.key.replaceAll('-', ' ')}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-[color:var(--color-muted)]">A</p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color:var(--color-border)]/70">
                          <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2))]" style={{ width: `${(s.a / max) * 100}%` }} />
                        </div>
                        <p className="mt-1 font-mono text-xs">{s.a}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[color:var(--color-muted)]">B</p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color:var(--color-border)]/70">
                          <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-accent-2),var(--color-accent))]" style={{ width: `${(s.b / max) * 100}%` }} />
                        </div>
                        <p className="mt-1 font-mono text-xs">{s.b}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
