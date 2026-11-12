import { useEffect, useRef, useState } from "react";

// Chrome, Edge and Safari support this. Firefox doesn't, so the button hides there.
const SpeechRecognition =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

const ERRORS = {
  "not-allowed": "Allow microphone access in your browser to order by voice.",
  "service-not-allowed": "Allow microphone access in your browser to order by voice.",
  "no-speech": "Didn't hear anything. Tap the mic and try again.",
};

export default function MicButton({ onText, onError }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Stop listening if the component disappears
  useEffect(() => () => recognitionRef.current?.abort(), []);

  if (!SpeechRecognition) return null;

  function start() {
    onError("");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-SG";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
        .toLowerCase()
        .replace(/[.?!]+$/, "");
      onText(text);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") onError(ERRORS[event.error] ?? "Voice input stopped. Tap the mic to try again.");
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stop() {
    recognitionRef.current?.stop();
  }

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      aria-label={listening ? "Stop listening" : "Say your order"}
      aria-pressed={listening}
      className={`flex size-12 shrink-0 items-center justify-center rounded-full text-chit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rim ${
        listening ? "bg-signred motion-safe:animate-pulse" : "bg-rim hover:bg-ink"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 18v3" />
      </svg>
    </button>
  );
}