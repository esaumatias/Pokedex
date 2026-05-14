import type { EvolutionChainLink, FlavorTextEntry } from '@/services/pokeapi';

export type EvolutionStep = {
  name: string;
  url: string;
  minLevel: number | null;
};

export function flattenEvolutionChain(link: EvolutionChainLink): EvolutionStep[][] {
  const rows: EvolutionStep[][] = [];

  function walk(node: EvolutionChainLink, path: EvolutionStep[]) {
    const detail = node.evolution_details[0];
    const minLevel = detail?.min_level ?? null;
    const step: EvolutionStep = {
      name: node.species.name,
      url: node.species.url,
      minLevel,
    };
    const nextPath = [...path, step];
    if (node.evolves_to.length === 0) {
      rows.push(nextPath);
      return;
    }
    for (const child of node.evolves_to) {
      walk(child, nextPath);
    }
  }

  walk(link, []);
  return rows;
}

export function scoreSearch(query: string, name: string): number {
  const q = query.trim().toLowerCase();
  const n = name.toLowerCase();
  if (!q) return 0;
  if (n === q) return 1000;
  if (n.startsWith(q)) return 800 - n.length;
  if (n.includes(q)) return 600 - n.length;
  const dist = levenshtein(q, n.slice(0, Math.min(n.length, q.length + 3)));
  if (dist <= 2) return 400 - dist * 50;
  return 0;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i]![0] = i;
  for (let j = 0; j <= n; j += 1) dp[0]![j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + cost);
    }
  }
  return dp[m]![n]!;
}

export function pickFlavorText(entries: FlavorTextEntry[]) {
  const langs = ['pt-BR', 'pt', 'en'];
  for (const lang of langs) {
    const e = entries.find((x) => x.language.name === lang);
    if (e) return e.flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' ');
  }
  const any = entries[0];
  return any ? any.flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' ') : '';
}
