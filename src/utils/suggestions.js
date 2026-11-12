import { TERMS } from "../data/kopiData";
import { decodeOrder } from "./decoder";

const ALL_ALIASES = new Set(TERMS.flatMap((term) => term.aliases));

// Most commonly ordered add-ons first, so the useful ones show up on top
const POPULAR = ["o", "c", "peng", "kosong", "siew dai", "gao", "po", "gah dai", "di lo", "tarik", "da bao", "halia"];
const rank = (term) => {
  const i = POPULAR.indexOf(term.aliases[0]);
  return i === -1 ? POPULAR.length : i;
};
const BY_POPULARITY = [...TERMS].sort((a, b) => rank(a) - rank(b));

// Suggests what to add next, based on what's already typed.
// "kopi"   -> "kopi o", "kopi c", "kopi kosong", ...
// "kopi s" -> "kopi siew dai"
export function getSuggestions(input, limit = 8) {
  const tokens = input
    .toLowerCase()
    .replace(/[-_,.!?/]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // If the last word looks half-typed, treat it as a prefix to complete
  const last = tokens[tokens.length - 1] ?? "";
  const stillTyping = !/\s$/.test(input) && last && !ALL_ALIASES.has(last);
  const partial = stillTyping ? last : "";
  const baseTokens = stillTyping ? tokens.slice(0, -1) : tokens;

  const base = decodeOrder(baseTokens.join(" "));
  const used = new Set(base.breakdown.map((part) => part.category));
  const hasDrink = used.has("drink");

  const suggestions = [];
  for (const term of BY_POPULARITY) {
    if (!hasDrink && term.category !== "drink") continue;
    if (hasDrink && term.category === "drink") continue;
    if (term.category === "extra" && base.extras.includes(term.value)) continue;
    if (term.category !== "extra" && term.category !== "drink" && used.has(term.category)) continue;

    // Use the main spelling, or another spelling once two letters are typed (e.g. "be" -> "beng")
    const alias = term.aliases[0].startsWith(partial)
      ? term.aliases[0]
      : partial.length >= 2 && term.aliases.find((a) => a.startsWith(partial));
    if (!alias) continue;

    suggestions.push([...baseTokens, alias].join(" "));
    if (suggestions.length === limit) break;
  }

  return suggestions;
}