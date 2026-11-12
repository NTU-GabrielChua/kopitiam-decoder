import { useRef, useState } from "react";
import { decodeOrder } from "./utils/decoder";
import Cup from "./components/Cup";
import { getSuggestions } from "./utils/suggestions";

const EXAMPLES = ["kopi-o kosong peng", "teh c siew dai", "milo gao da bao", "teh tarik"];

// Turns the decoded result into one readable line, e.g. "Iced coffee, no milk, no sugar"
function describe(result) {
  if (!result.drink) return "Start with a drink: kopi, teh or milo";

  const parts = [`${result.temperature === "Iced" ? "Iced" : "Hot"} ${result.drink.toLowerCase()}`];
  parts.push(result.milk === "No milk" ? "no milk" : `with ${result.milk.toLowerCase()}`);
  if (result.sweetness !== "Normal") parts.push(result.sweetness.toLowerCase());
  if (result.strength !== "Normal") parts.push(result.strength.toLowerCase());
  parts.push(...result.extras.map((extra) => extra.toLowerCase()));

  return parts.join(", ");
}

function App() {
  const [order, setOrder] = useState("");
  const result = decodeOrder(order);
  const hasInput = order.trim().length > 0;
  const summary = describe(result);
  const inputRef = useRef(null);

  // Empty box: show example orders. Typing: suggest what to add next.
  const chips = hasInput ? getSuggestions(order) : EXAMPLES;

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
            Type a drink order the way uncle says it, and see what's in the cup.
          </p>
        </header>

        <section className="mt-10">
          <label htmlFor="order" className="text-sm font-semibold">
            Your order
          </label>
          <input
            id="order"
            ref={inputRef}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="kopi-o kosong peng"
            autoComplete="off"
            className="mt-2 w-full border-b-4 border-ink bg-transparent pb-2 font-display text-3xl placeholder:text-ink/25 focus:border-rim focus:outline-none sm:text-4xl"
          />
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
            {!hasInput ? (
              <p className="text-lg">
                Start typing, or tap an example. Every word you type shows up here with what it means and how to say it.
              </p>
            ) : (
              <>
                <h2 className="font-display text-2xl">What you said</h2>
                {result.breakdown.length > 0 && (
                  <dl className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
                    {result.breakdown.map((part, index) => (
                      <div key={index} className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="font-display text-xl text-rim">{part.typed}</dt>
                        <dd className="text-right">
                          <span className="block">{part.meaning}</span>
                          <span className="text-sm text-ink/60">say "{part.say}"</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {result.unknown.length > 0 && (
                  <p className="mt-4 rounded-lg bg-signred/10 p-3 text-signred">
                    "{result.unknown.join(" ")}" isn't in the decoder yet. Check the spelling, or start with kopi, teh or milo.
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        <footer className="mt-16 text-sm text-ink/60">
          Built by Gabriel for AED08D.
        </footer>
      </main>
    </div>
  );
}

export default App;