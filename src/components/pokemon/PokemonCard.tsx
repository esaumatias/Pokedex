import { motion } from 'framer-motion';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { usePreferences } from '@/context/PreferencesContext';
import { cn } from '@/lib/cn';
import type { Pokemon } from '@/services/pokeapi';

function artwork(p: Pokemon) {
  return (
    p.sprites.other?.['official-artwork']?.front_default ??
    p.sprites.other?.home?.front_default ??
    p.sprites.front_default ??
    ''
  );
}

type Props = {
  pokemon: Pokemon;
  index?: number;
};

export const PokemonCard = memo(function PokemonCard({ pokemon, index = 0 }: Props) {
  const { isFavorite, toggleFavorite, playTap } = usePreferences();
  const img = artwork(pokemon);
  const fav = isFavorite(pokemon.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.02, 0.24), ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 p-4 shadow-[var(--shadow-glow)] backdrop-blur-md transition will-change-transform',
          'hover:-translate-y-1 hover:border-[color:var(--color-accent)]/35',
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.2_275/0.35),transparent_65%)]" />
          <div className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.72_0.16_200/0.28),transparent_65%)]" />
        </div>

        <button
          type="button"
          aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={cn(
            'absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 text-lg shadow-sm backdrop-blur-md transition hover:border-[color:var(--color-accent)]/40',
            fav && 'text-rose-400',
          )}
          onClick={(e) => {
            e.preventDefault();
            playTap();
            toggleFavorite(pokemon.id);
          }}
        >
          {fav ? '★' : '☆'}
        </button>

        <Link
          to={`/pokemon/${pokemon.name}`}
          className="relative z-10 mt-1 block outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
        >
          <div className="pr-12">
            <p className="font-mono text-xs text-[color:var(--color-muted)]">#{String(pokemon.id).padStart(4, '0')}</p>
            <h3 className="text-lg font-semibold capitalize tracking-tight text-[color:var(--color-fg)]">{pokemon.name.replaceAll('-', ' ')}</h3>
          </div>

          <div className="relative mx-auto mt-3 aspect-square w-[min(100%,220px)]">
            <div className="absolute inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.35),transparent_55%)] opacity-70 dark:bg-[radial-gradient(circle_at_30%_20%,oklch(0.55_0.12_275/0.35),transparent_55%)]" />
            {img ? (
              <img
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                className="relative z-10 mx-auto h-full w-full max-w-[220px] object-contain drop-shadow-xl transition duration-300 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[color:var(--color-muted)]">Sem arte</div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {pokemon.types
              .slice()
              .sort((a, b) => a.slot - b.slot)
              .map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
          </div>
        </Link>
      </div>
    </motion.article>
  );
});
