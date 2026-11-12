import { TERMS, DEFAULTS } from "../data/kopiData";

// Turn "Kopi-O  Kosong, PENG" into ["kopi", "o", "kosong", "peng"]
function tokenize(input) {
  return input
    .toLowerCase()
    .replace(/[-_,.!?/]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Every alias split into words, longest first,
// so "siew dai" is matched before anything shorter.
const PATTERNS = TERMS.flatMap((term) =>
  term.aliases.map((alias) => ({ words: alias.split(" "), term }))
).sort((a, b) => b.words.length - a.words.length);

function matchAt(tokens, i) {
  for (const pattern of PATTERNS) {
    const slice = tokens.slice(i, i + pattern.words.length);
    if (slice.join(" ") === pattern.words.join(" ")) return pattern;
  }
  return null;
}

export function decodeOrder(input) {
  const tokens = tokenize(input);
  const result = { ...DEFAULTS, extras: [], breakdown: [], unknown: [] };

  let i = 0;
  while (i < tokens.length) {
    const match = matchAt(tokens, i);

    if (match) {
      const { term } = match;
      const typed = tokens.slice(i, i + match.words.length).join(" ");

      if (term.category === "extra") result.extras.push(term.value);
      else result[term.category] = term.value;

      result.breakdown.push({ typed, meaning: term.meaning, say: term.say, category: term.category, value: term.value });
      i += match.words.length;
    } else {
      result.unknown.push(tokens[i]);
      i += 1;
    }
  }

  return result;
}