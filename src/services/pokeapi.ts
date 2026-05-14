const POKE = 'https://pokeapi.co/api/v2';

export class PokeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'PokeApiError';
    this.status = status;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new PokeApiError(`Falha na requisição (${res.status})`, res.status);
  }
  return res.json() as Promise<T>;
}

export type NamedAPIResource = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type PokemonTypeSlot = {
  slot: number;
  type: NamedAPIResource;
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
};

export type PokemonAbilitySlot = {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
};

export type PokemonSprites = {
  other?: {
    'official-artwork'?: { front_default: string | null };
    home?: { front_default: string | null; front_shiny?: string | null };
  };
  front_default: string | null;
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbilitySlot[];
  sprites: PokemonSprites;
  species: NamedAPIResource;
};

export type FlavorTextEntry = {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
};

export type PokemonSpecies = {
  id: number;
  name: string;
  evolution_chain: { url: string };
  flavor_text_entries: FlavorTextEntry[];
  genera: { genus: string; language: NamedAPIResource }[];
  color: NamedAPIResource;
  habitat: NamedAPIResource | null;
  capture_rate: number;
  base_happiness: number;
  growth_rate: NamedAPIResource;
  egg_groups: NamedAPIResource[];
};

export type TypeDamageRelations = {
  double_damage_from: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  no_damage_to: NamedAPIResource[];
};

export type TypeInfo = {
  id: number;
  name: string;
  damage_relations: TypeDamageRelations;
  pokemon: { pokemon: NamedAPIResource; slot: number }[];
};

export type EvolutionChainLink = {
  species: NamedAPIResource;
  evolves_to: EvolutionChainLink[];
  evolution_details: {
    min_level: number | null;
    trigger: NamedAPIResource;
    item: NamedAPIResource | null;
  }[];
};

export type EvolutionChain = {
  id: number;
  chain: EvolutionChainLink;
};

export function getPokemonList(offset: number, limit: number) {
  return fetchJson<PokemonListResponse>(`${POKE}/pokemon?offset=${offset}&limit=${limit}`);
}

export function getPokemon(nameOrId: string | number) {
  const key = typeof nameOrId === 'number' ? nameOrId : encodeURIComponent(String(nameOrId).toLowerCase());
  return fetchJson<Pokemon>(`${POKE}/pokemon/${key}`);
}

export function getPokemonSpecies(nameOrId: string | number) {
  const key = typeof nameOrId === 'number' ? nameOrId : encodeURIComponent(String(nameOrId).toLowerCase());
  return fetchJson<PokemonSpecies>(`${POKE}/pokemon-species/${key}`);
}

export function getEvolutionChain(url: string) {
  return fetchJson<EvolutionChain>(url);
}

export function getType(name: string) {
  return fetchJson<TypeInfo>(`${POKE}/type/${encodeURIComponent(name)}`);
}

export function extractIdFromPokemonUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts.at(-1));
}

export async function getPokemonBatch(names: string[]) {
  const settled = await Promise.allSettled(names.map((n) => getPokemon(n)));
  const ok: Pokemon[] = [];
  for (const s of settled) {
    if (s.status === 'fulfilled') ok.push(s.value);
  }
  return ok;
}
