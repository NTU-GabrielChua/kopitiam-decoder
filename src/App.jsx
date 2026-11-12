import { useRef, useState } from "react";
import { decodeOrder } from "./utils/decoder";
import { getSuggestions } from "./utils/suggestions";
import { translateEnglish } from "./utils/translator";
import Cup from "./components/Cup";
import MicButton from "./components/MicButton";

const MODES = {
  decode: {
    tab: "Decode an order",
    label: "Your order",
    placeholder: "kopi-o kosong peng",
    examples: ["kopi-o kosong peng", "teh c siew dai", "milo gao da bao", "teh tarik"],
    empty: "Start typing, or tap an example. Every word you type shows up here with what it means and how to say it.",
  },
  order: {
    tab: "Help me order",
    label: "What would you like?",
    placeholder: "iced latte, less sweet",
    examples: ["black coffee", "iced latte less sweet", "espresso", "hot chocolate to go"],
    empty: "Describe your drink in English, the way you would at a cafe. You'll get the words to say at the kopitiam counter.",
  },
};

// Turns a decoded order into one readable line, e.g. "Iced coffee, no milk, no sugar"
function describe(result) {
  if (!result.drink) return "Start with a drink: kopi, teh or milo";

  const parts = [`${result.temperature === "Iced" ? "Iced" : "Hot"} ${result.drink.toLowerCase()}`];
  parts.push(result.milk === "No milk" ? "no milk" : `with ${result.milk.toLowerCase()}`);
  if (result.sweetness !== "Normal") parts.push(result.sweetness.toLowerCase());
  if (result.strength !== "Normal") parts.push(result.strength.toLowerCase());
  parts.push(...result.extras.map((extra) => extra.toLowerCase()));

  return parts.join(", ");
}

// English add-ons to suggest once a drink is chosen in "Help me order"
function englishAddOns(order, state) {
  const addOns = [];
  if (state.sweetness === "Normal") addOns.push("no sugar", "less sweet");
  if (state.temperature !== "Iced") addOns.push("iced");
  if (state.strength === "Normal") addOns.push("strong");
  if (!state.extras.includes("Takeaway")) addOns.push("to go");
  return addOns.map((addOn) => `${order.trim()} ${addOn}`);
}

function Breakdown({ parts }) {
  return (
    <dl className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
      {parts.map((part, index) => (
        <div key={index} className="flex items-baseline justify-between gap-4 py-3">
          <dt className="font-display text-xl text-rim">{part.typed}</dt>
          <dd className="text-right">
            <span className="block">{part.meaning}</span>
            <span className="text-sm text-ink/60">say "{part.say}"</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function App() {
  const [mode, setMode] = useState("decode");
  const [order, setOrder] = useState("");
  const [micError, setMicError] = useState("");
  const inputRef = useRef(null);

  const copy = MODES[mode];
  const hasInput = order.trim().length > 0;

  // In "Help me order", turn the English into kopitiam words first, then decode those for the cup
  const translation = mode === "order" ? translateEnglish(order) : null;
  const result = decodeOrder(mode === "order" ? translation.phrase : order);
  const summary = describe(result);

  let chips = copy.examples;
  if (hasInput && mode === "decode") chips = getSuggestions(order);
  if (hasInput && mode === "order") chips = translation.hasDrink ? englishAddOns(order, translation.state) : [];

  function switchMode(next) {
    setMode(next);
    setOrder("");
    setMicError("");
  }

  function pick(text) {
    // Add a space so the next round of suggestions appears straight away
    setOrder(hasInput ? `${text} ` : text);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-marble font-sans text-ink">
      <main className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
        <header>
          <h1 className="font-display text-5xl leading-none text-rim sm:text-7xl">
            Kopitiam
            <br />
            Decoder
          </h1>
          <p className="mt-4 max-w-md text-lg">
            Find out what's in a kopitiam drink order, or learn how to order your own.
          </p>
        </header>

        <div className="mt-8 inline-flex rounded-full border-2 border-ink p-1">
          {Object.entries(MODES).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => switchMode(key)}
              aria-pressed={mode === key}
              className={`rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rim ${
                mode === key ? "bg-ink text-chit" : "hover:bg-ink/10"
              }`}
            >
              {value.tab}
            </button>
          ))}
        </div>

        <section className="mt-8">
          <label htmlFor="order" className="text-sm font-semibold">
            {copy.label}
          </label>
          <div className="mt-2 flex items-end gap-3">
            <input
              id="order"
              ref={inputRef}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder={copy.placeholder}
              autoComplete="off"
              className="min-w-0 flex-1 border-b-4 border-ink bg-transparent pb-2 font-display text-3xl placeholder:text-ink/25 focus:border-rim focus:outline-none sm:text-4xl"
            />
            {mode === "order" && <MicButton onText={setOrder} onError={setMicError} />}
          </div>
          {micError && (
            <p role="alert" className="mt-2 text-sm text-signred">
              {micError}
            </p>
          )}

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm">{hasInput ? "Add:" : "Try:"}</span>
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => pick(chip)}
                  className="rounded-full border-2 border-rim px-3 py-1 text-sm font-semibold text-rim hover:bg-rim hover:text-chit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rim"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </section>

        <section
          aria-live="polite"
          className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start"
        >
          <div>
            <Cup result={result} label={hasInput ? summary : "An empty kopi cup"} />
            <p className="mt-3 text-center text-lg font-semibold">{hasInput ? summary : "Your cup is empty"}</p>
          </div>

          <div>
            {!hasInput && <p className="text-lg">{copy.empty}</p>}

            {hasInput && mode === "decode" && (
              <>
                <h2 className="font-display text-2xl">What you said</h2>
                {result.breakdown.length > 0 && <Breakdown parts={result.breakdown} />}
                {result.unknown.length > 0 && (
                  <p className="mt-4 rounded-lg bg-signred/10 p-3 text-signred">
                    "{result.unknown.join(" ")}" isn't in the decoder yet. Check the spelling, or start with kopi, teh or milo.
                  </p>
                )}
              </>
            )}

            {hasInput && mode === "order" && !translation.hasDrink && (
              <p className="rounded-lg bg-signred/10 p-3 text-signred">
                Name a drink to start, like coffee, latte, tea or hot chocolate.
              </p>
            )}

            {hasInput && mode === "order" && translation.hasDrink && (
              <>
                <h2 className="font-display text-2xl">Say this at the counter</h2>
                <p className="mt-2 font-display text-4xl text-rim">{translation.phrase}</p>
                {translation.notes.map((note) => (
                  <p key={note} className="mt-3 text-ink/80">
                    {note}
                  </p>
                ))}
                <h2 className="mt-8 font-display text-2xl">What each word means</h2>
                <Breakdown parts={result.breakdown} />
              </>
            )}
          </div>
        </section>

        <footer className="mt-16 text-sm text-ink/60">Built by Gabriel for AED08D.</footer>
      </main>
    </div>
  );
}

export default App;