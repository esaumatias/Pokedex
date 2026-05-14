export const POKEMON_TYPES = [
  'Todos',
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
  'stellar',
] as const;

export type PokemonTypeFilter = (typeof POKEMON_TYPES)[number];

export const STAT_LABELS_PT: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade',
};
