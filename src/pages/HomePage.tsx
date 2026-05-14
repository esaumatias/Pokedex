import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { POKEMON_TYPES, type PokemonTypeFilter } from '@/constants/pokemon';
import { usePreferences } from '@/context/PreferencesContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { scoreSearch } from '@/lib/pokemon-utils';
import { getPokemon, getPokemonBatch, getPokemonList, getType, type Pokemon } from '@/services/pokeapi';

const PAGE = 24;

export function HomePage() {
  useDocumentMeta({
    title: 'Pokédex — Explorar',
    description: 'Explore Pokémon com busca inteligente, filtros por tipo, favoritos e comparação.',
  });

  const { history, clearHistory } = usePreferences();
  const [type, setType] = useState<PokemonTypeFilter>('Todos');
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 220);

  const idSearch = debounced.trim();
  const isId = /^\d+$/.test(idSearch);
  const idNum = isId ? Number(idSearch) : NaN;

  const byId = useQuery({
    queryKey: ['pokemon', idNum] as const,
    queryFn: () => getPokemon(idNum),
    enabled: Number.isFinite(idNum) && idNum > 0,
  });

  const allNames = useQuery({
    queryKey: ['dex-names'] as const,
    queryFn: async () => (await getPokemonList(0, 2000)).results.map((r) => r.name),
  });

  const typeNames = useQuery({
    queryKey: ['dex-type-names', type] as const,
    enabled: type !== 'Todos',
    queryFn: async () => (await getType(type.toLowerCase())).pokemon.map((p) => p.pokemon.name),
  });

  const poolReady = useMemo(() => {
    if (isId) return false;
    if (type === 'Todos' && !debounced.trim()) return true;
    if (type === 'Todos') return allNames.isSuccess;
    return typeNames.isSuccess;
  }, [isId, type, debounced, allNames.isSuccess, typeNames.isSuccess]);

  const activePool = useMemo(() => {
    if (type === 'Todos') return allNames.data ?? [];
    return typeNames.data ?? [];
  }, [type, allNames.data, typeNames.data]);

  const customList = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (isId) return null;
    if (!q) {
      if (type === 'Todos') return null;
      return activePool;
    }
    return activePool
      .map((n) => ({ n, s: scoreSearch(q, n) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.n);
  }, [activePool, debounced, isId, type]);

  const listRef = useRef<string[] | null>(null);
  listRef.current = customList;

  const feed = useInfiniteQuery({
    queryKey: ['dex-feed', type, debounced, isId ? 'id' : 'list'] as const,
    enabled: poolReady && !isId,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const useApiOffset = listRef.current === null;
      if (useApiOffset) {
        const offset = pageParam as number;
        const data = await getPokemonList(offset, PAGE);
        const mons = await getPokemonBatch(data.results.map((r) => r.name));
        return { mons, next: data.next ? offset + PAGE : undefined };
      }
      const list = listRef.current!;
      const offset = pageParam as number;
      const slice = list.slice(offset, offset + PAGE);
      if (slice.length === 0) return { mons: [] as Pokemon[], next: undefined };
      const mons = await getPokemonBatch(slice);
      return { mons, next: offset + PAGE < list.length ? offset + PAGE : undefined };
    },
    getNextPageParam: (last) => last.next,
  });

  const merged = useMemo(() => {
    const map = new Map<number, Pokemon>();
    if (isId && byId.data) map.set(byId.data.id, byId.data);
    for (const page of feed.data?.pages ?? []) {
      for (const p of page.mons) map.set(p.id, p);
    }
    return [...map.values()].sort((a, b) => a.id - b.id);
  }, [feed.data, byId.data, isId]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isId) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage) void feed.fetchNextPage();
      },
      { rootMargin: '480px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [feed, isId]);

  const loadingFirst = !isId && feed.isPending && merged.length === 0;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-6 shadow-[var(--shadow-glow)] backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-muted)]">Experiência premium</p>
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--color-fg)] sm:text-4xl">Sua Pokédex, reinventada.</h1>
            <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">
              Busca inteligente, filtros modernos, favoritos com persistência e uma ficha detalhada com fraquezas, stats e evoluções.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-muted)]">
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 px-3 py-1">TanStack Query</span>
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 px-3 py-1">Framer Motion</span>
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 px-3 py-1">Tailwind v4</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_minmax(0,220px)]">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque por nome, parte do nome ou número da Pokédex…"
            aria-label="Buscar Pokémon"
            inputMode="search"
          />
          <label className="grid gap-1 text-xs text-[color:var(--color-muted)]">
            Tipo
            <select
              className="h-11 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 px-3 text-sm font-medium text-[color:var(--color-fg)] outline-none focus:border-[color:var(--color-accent)]/60 focus:ring-2 focus:ring-[color:var(--color-accent)]/25"
              value={type}
              onChange={(e) => setType(e.target.value as PokemonTypeFilter)}
            >
              {POKEMON_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'Todos' ? 'Todos os tipos' : t}
                </option>
              ))}
            </select>
          </label>
        </div>

        {type !== 'Todos' && typeNames.isError ? (
          <p className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-100">
            Não foi possível carregar este tipo na PokéAPI. Escolha outro tipo ou volte para “Todos”.
          </p>
        ) : null}

        {history.length > 0 ? (
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Histórico</p>
              <button type="button" className="text-xs font-medium text-[color:var(--color-accent)] hover:underline" onClick={clearHistory}>
                Limpar
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 px-3 py-1 text-xs font-semibold capitalize text-[color:var(--color-fg)] transition hover:border-[color:var(--color-accent)]/40"
                  onClick={() => setQuery(h)}
                >
                  {h.replaceAll('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {isId ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[color:var(--color-fg)]">Resultado por número</h2>
            <button type="button" className="text-xs font-medium text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]" onClick={() => setQuery('')}>
              Limpar busca
            </button>
          </div>
          {byId.isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[340px]" />
              ))}
            </div>
          ) : byId.isError ? (
            <p className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/50 p-4 text-sm text-[color:var(--color-muted)]">
              Não encontramos um Pokémon com esse número. Tente outro ID.
            </p>
          ) : byId.data ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <PokemonCard pokemon={byId.data} />
            </div>
          ) : null}
        </section>
      ) : (
        <>
          {feed.isError ? (
            <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              Não foi possível carregar a lista. Verifique sua conexão e tente novamente.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingFirst
              ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-[340px]" />)
              : merged.map((p, idx) => <PokemonCard key={p.id} pokemon={p} index={idx} />)}
          </div>

          <div ref={sentinelRef} className="h-10" />

          <div className="flex items-center justify-center gap-3 pb-6 text-xs text-[color:var(--color-muted)]">
            {feed.isFetchingNextPage ? <span>Carregando mais…</span> : null}
            {!feed.hasNextPage && merged.length > 0 ? <span>Você chegou ao fim desta lista.</span> : null}
          </div>
        </>
      )}
    </div>
  );
}
