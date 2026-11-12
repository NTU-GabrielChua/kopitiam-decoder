import { ENGLISH_PHRASES } from "../data/englishData";
import { DEFAULTS } from "../data/kopiData";

// Longest phrases first, so "black coffee" wins over "black" and "coffee"
const SORTED = ENGLISH_PHRASES.flatMap((entry) =>
  entry.phrases.map((phrase) => ({ phrase, entry }))
).sort((a, b) => b.phrase.length - a.phrase.length);

// The kopitiam word for each setting
const WORDS = {
  drink: { Coffee: "kopi", Tea: "teh", Milo: "milo", "Coffee + tea": "yuan yang" },
  milk: { "No milk": "o", "Evaporated milk": "c" },
  strength: { Weak: "po", Strong: "gao", "Extra strong": "di lo" },
  sweetness: { "No sugar": "kosong", "Less sweet": "siew dai", Sweeter: "gah dai" },
  temperature: { Iced: "peng" },
  extras: { Pulled: "tarik", "With ginger": "halia", Takeaway: "da bao" },
};

function buildPhrase(state) {
  const milk = WORDS.milk[state.milk];
  const head = WORDS.drink[state.drink] + (milk ? `-${milk}` : "");

  return [
    head,
    WORDS.strength[state.strength],
    WORDS.sweetness[state.sweetness],
    WORDS.temperature[state.temperature],
    ...state.extras.map((extra) => WORDS.extras[extra]),
  ]
    .filter(Boolean)
    .join(" ");
}

// "iced latte, less sweet" -> { phrase: "kopi-c siew dai peng", ... }
export function translateEnglish(input) {
  let text = ` ${input.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim()} `;

  const drinks = [];
  const modifiers = [];
  for (const { phrase, entry } of SORTED) {
    const needle = ` ${phrase} `;
    if (text.includes(needle)) {
      (entry.type === "drink" ? drinks : modifiers).push(entry);
      text = text.replace(needle, " | ");
    }
  }

  // Drinks set the starting point, then modifiers like "less sweet" change it
  const state = { ...DEFAULTS, extras: [] };
  const notes = [];
  for (const entry of [...drinks, ...modifiers]) {
    for (const [key, value] of Object.entries(entry.set)) {
      if (key === "extras") {
        for (const extra of value) if (!state.extras.includes(extra)) state.extras.push(extra);
      } else {
        state[key] = value;
      }
    }
    if (entry.note) notes.push(entry.note);
  }

  const hasDrink = Boolean(state.drink);
  return { phrase: hasDrink ? buildPhrase(state) : "", hasDrink, notes, state };
}