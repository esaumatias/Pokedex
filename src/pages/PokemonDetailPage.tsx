import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { EvolutionSection } from '@/components/pokemon/EvolutionSection';
import { StatBars } from '@/components/pokemon/StatBars';
import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { TypeMatchups } from '@/components/pokemon/TypeMatchups';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePreferences } from '@/context/PreferencesContext';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { pickFlavorText } from '@/lib/pokemon-utils';
import { cn } from '@/lib/cn';
import { getEvolutionChain, getPokemon, getPokemonSpecies } from '@/services/pokeapi';

function artworkUrl(p: Awaited<ReturnType<typeof getPokemon>>) {
  return (
    p.sprites.other?.['official-artwork']?.front_default ??
    p.sprites.other?.home?.front_default ??
    p.sprites.front_default ??
    ''
  );
}

export function PokemonDetailPage() {
  const raw = useParams();
  const name = decodeURIComponent(raw.name ?? '').trim();
  const { pushHistory, isFavorite, toggleFavorite, playTap } = usePreferences();

  const pokemon = useQuery({
    queryKey: ['pokemon', name] as const,
    queryFn: () => getPokemon(name),
    enabled: name.length > 0,
  });

  const species = useQuery({
    queryKey: ['species', pokemon.data?.id ?? 0] as const,
    queryFn: () => getPokemonSpecies(pokemon.data!.id),
    enabled: Boolean(pokemon.data?.id),
  });

  const chain = useQuery({
    queryKey: ['evolution-chain', species.data?.evolution_chain.url ?? ''] as const,
    queryFn: () => getEvolutionChain(species.data!.evolution_chain.url),
    enabled: !!species.data?.evolution_chain.url,
  });

  useEffect(() => {
    if (pokemon.data?.name) pushHistory(pokemon.data.name);
  }, [pokemon.data?.name, pushHistory]);

  const flavor = useMemo(() => pickFlavorText(species.data?.flavor_text_entries ?? []), [species.data?.flavor_text_entries]);

  const genus = useMemo(() => {
    const g = species.data?.genera ?? [];
    return (
      g.find((x) => x.language.name === 'pt-BR')?.genus ??
      g.find((x) => x.language.name === 'pt')?.genus ??
      g.find((x) => x.language.name === 'en')?.genus ??
      ''
    );
  }, [species.data?.genera]);

  const typeNames = useMemo(() => (pokemon.data?.types ?? []).slice().sort((a, b) => a.slot - b.slot).map((t) => t.type.name), [pokemon.data?.types]);

  const pageTitle = pokemon.data
    ? `${pokemon.data.name.replaceAll('-', ' ')} — Pokédex`
    : 'Pokémon — Pokédex';
  const pageDescription = flavor
    ? flavor.slice(0, 180)
    : pokemon.data
      ? `Ficha de ${pokemon.data.name.replaceAll('-', ' ')} na Pokédex.`
      : undefined;

  useDocumentMeta({ title: pageTitle, description: pageDescription });

  if (!name) {
    return (
      <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-6">
        <p className="text-sm text-[color:var(--color-muted)]">Pokémon inválido.</p>
        <Link className="mt-3 inline-block text-sm font-semibold text-[color:var(--color-accent)]" to="/">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-sm font-semibold text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]">
          ← Voltar para a lista
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link to={`/compare?a=${encodeURIComponent(name)}&b=`}>
            <Button type="button" variant="outline" size="sm" className="rounded-2xl">
              Comparar com…
            </Button>
          </Link>
        </div>
      </div>

      {pokemon.isPending ? (
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
        </div>
      ) : pokemon.isError ? (
        <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-6">
          <p className="text-sm text-[color:var(--color-muted)]">Não encontramos esse Pokémon.</p>
          <Link className="mt-3 inline-block text-sm font-semibold text-[color:var(--color-accent)]" to="/">
            Voltar
          </Link>
        </div>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-6 shadow-[var(--shadow-glow)] backdrop-blur-md"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.2_275/0.35),transparent_65%)]" />
                <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.16_200/0.28),transparent_65%)]" />
              </div>

              <div className="relative flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-[color:var(--color-muted)]">#{String(pokemon.data.id).padStart(4, '0')}</p>
                    <h1 className="text-3xl font-semibold capitalize tracking-tight sm:text-4xl">{pokemon.data.name.replaceAll('-', ' ')}</h1>
                    {genus ? <p className="mt-1 text-sm text-[color:var(--color-muted)]">{genus}</p> : null}
                  </div>

                  <button
                    type="button"
                    className={cn(
                      'inline-flex h-11 items-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 px-4 text-sm font-semibold transition hover:border-[color:var(--color-accent)]/40',
                      isFavorite(pokemon.data.id) && 'text-rose-400',
                    )}
                    onClick={() => {
                      playTap();
                      toggleFavorite(pokemon.data.id);
                    }}
                  >
                    <span className="text-lg">{isFavorite(pokemon.data.id) ? '★' : '☆'}</span>
                    {isFavorite(pokemon.data.id) ? 'Favorito' : 'Favoritar'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {typeNames.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>

                <div className="relative mx-auto aspect-square w-[min(100%,420px)]">
                  <div className="absolute inset-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.35),transparent_55%)] opacity-70 dark:bg-[radial-gradient(circle_at_30%_20%,oklch(0.55_0.12_275/0.35),transparent_55%)]" />
                  {artworkUrl(pokemon.data) ? (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      src={artworkUrl(pokemon.data)!}
                      alt=""
                      className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[color:var(--color-muted)]">Sem arte oficial</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/35 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Altura</p>
                    <p className="mt-1 font-mono text-sm">{(pokemon.data.height / 10).toFixed(1)} m</p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/35 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Peso</p>
                    <p className="mt-1 font-mono text-sm">{(pokemon.data.weight / 10).toFixed(1)} kg</p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/35 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Exp. base</p>
                    <p className="mt-1 font-mono text-sm">{pokemon.data.base_experience ?? '—'}</p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/35 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Captura</p>
                    <p className="mt-1 font-mono text-sm">{species.data?.capture_rate ?? '—'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md">
                <h2 className="text-sm font-semibold tracking-wide text-[color:var(--color-muted)]">Descrição</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg)]">{flavor || 'Sem descrição disponível no idioma selecionado.'}</p>
              </div>

              <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md">
                <h2 className="text-sm font-semibold tracking-wide text-[color:var(--color-muted)]">Habilidades</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pokemon.data.abilities
                    .slice()
                    .sort((a, b) => a.slot - b.slot)
                    .map((a) => (
                      <span
                        key={a.ability.name}
                        className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/35 px-3 py-2 text-xs font-semibold capitalize text-[color:var(--color-fg)]"
                      >
                        {a.ability.name.replaceAll('-', ' ')}
                        {a.is_hidden ? <span className="ml-2 text-[10px] font-semibold text-[color:var(--color-muted)]">(oculta)</span> : null}
                      </span>
                    ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-5 backdrop-blur-md">
                <h2 className="text-sm font-semibold tracking-wide text-[color:var(--color-muted)]">Atributos base</h2>
                <div className="mt-4">
                  <StatBars stats={pokemon.data.stats} />
                </div>
              </div>
            </motion.div>
          </section>

          <TypeMatchups typeNames={typeNames} />

          {chain.isPending ? (
            <Skeleton className="h-[220px]" />
          ) : chain.data ? (
            <EvolutionSection chain={chain.data} activeName={pokemon.data.name} />
          ) : null}
        </>
      )}
    </div>
  );
}
