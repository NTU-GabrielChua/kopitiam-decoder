// A classic green-rimmed kopitiam cup, seen slightly from above.
// The drink colour, ice, steam, froth and sugar cubes all change with the order.

const INK = "#1e1b18";
const PORCELAIN = "#fbfaf5";
const RIM = "#2e6a4c";

const BASE_COLOUR = {
  Coffee: "#3b2418",
  Tea: "#9a5424",
  Milo: "#5a3520",
  "Coffee + tea": "#4e2e1b",
};

const SUGAR_CUBES = { "No sugar": 0, "Less sweet": 1, Normal: 2, Sweeter: 3 };

const CUBE_SPOTS = [
  { x: 24, y: 158 },
  { x: 40, y: 161 },
  { x: 31, y: 146 },
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Blend colour a towards colour b by amount t (0 to 1)
function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return (
    "#" +
    A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("")
  );
}

function liquidColour({ drink, milk, strength }) {
  let colour = BASE_COLOUR[drink] ?? BASE_COLOUR.Coffee;

  if (strength === "Weak") colour = mix(colour, "#d9c3a5", 0.35);
  if (strength === "Strong") colour = mix(colour, "#120a06", 0.25);
  if (strength === "Extra strong") colour = mix(colour, "#0a0503", 0.45);

  if (milk === "Condensed milk") colour = mix(colour, "#f1e2c2", 0.3);
  if (milk === "Evaporated milk") colour = mix(colour, "#f4ecdd", 0.4);

  return colour;
}

export default function Cup({ result, label }) {
  const hasDrink = Boolean(result.drink);
  const fill = hasDrink ? liquidColour(result) : "#e4e6e1";
  const iced = hasDrink && result.temperature === "Iced";
  const hot = hasDrink && !iced;
  const frothy = hasDrink && result.extras.includes("Pulled");
  const cubes = hasDrink ? SUGAR_CUBES[result.sweetness] ?? 2 : 0;

  return (
    <svg viewBox="0 0 240 210" role="img" aria-label={label} className="mx-auto w-full max-w-xs">
      {/* Steam */}
      {hot && (
        <g fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round">
          <path d="M102 58 c-8 -10 8 -16 0 -30" />
          <path d="M120 54 c-8 -10 8 -16 0 -30" />
          <path d="M138 58 c-8 -10 8 -16 0 -30" />
        </g>
      )}

      {/* Saucer */}
      <ellipse cx="120" cy="178" rx="104" ry="18" fill={PORCELAIN} stroke={INK} strokeWidth="3" />
      <ellipse cx="120" cy="178" rx="86" ry="12" fill="none" stroke={RIM} strokeWidth="3" />

      {/* Sugar cubes on the saucer */}
      {CUBE_SPOTS.slice(0, cubes).map((spot, i) => (
        <rect
          key={i}
          x={spot.x}
          y={spot.y}
          width="13"
          height="13"
          rx="2"
          fill="#ffffff"
          stroke={INK}
          strokeWidth="2"
        />
      ))}

      {/* Handle */}
      <path d="M174 96 C210 96 210 140 166 140" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M174 96 C210 96 210 140 166 140" fill="none" stroke={PORCELAIN} strokeWidth="7" strokeLinecap="round" />

      {/* Cup body with green rim bands */}
      <path
        d="M60 80 L180 80 L168 142 Q164 162 140 162 L100 162 Q76 162 72 142 Z"
        fill={PORCELAIN}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M65 100 L175 100" stroke={RIM} strokeWidth="6" />
      <path d="M67 109 L173 109" stroke={RIM} strokeWidth="2" />

      {/* Opening and drink surface */}
      <ellipse cx="120" cy="80" rx="60" ry="13" fill={PORCELAIN} stroke={INK} strokeWidth="3" />
      <ellipse className="liquid" cx="120" cy="82" rx="51" ry="9" fill={fill} />

      {/* Froth for tarik */}
      {frothy && <ellipse cx="120" cy="82" rx="38" ry="6" fill="#f3e7cf" opacity="0.85" />}

      {/* Ice for peng */}
      {iced && (
        <g fill="#ffffff" fillOpacity="0.8" stroke="#9cc3d1" strokeWidth="2">
          <rect x="92" y="74" width="16" height="12" rx="3" transform="rotate(-12 100 80)" />
          <rect x="114" y="72" width="16" height="12" rx="3" transform="rotate(8 122 78)" />
          <rect x="134" y="76" width="14" height="11" rx="3" transform="rotate(-6 141 81)" />
        </g>
      )}
    </svg>
  );
}