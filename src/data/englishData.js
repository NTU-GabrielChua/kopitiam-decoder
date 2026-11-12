// English words people use at cafes, mapped to kopitiam settings.
// "set" uses the same values as kopiData.js. "note" explains approximations.

export const ENGLISH_PHRASES = [
  // Drinks
  {
    type: "drink",
    phrases: ["black coffee", "americano", "long black"],
    set: { drink: "Coffee", milk: "No milk", sweetness: "No sugar" },
    note: "Kopitiam black coffee comes sweetened unless you ask for it kosong.",
  },
  {
    type: "drink",
    phrases: ["espresso", "double shot"],
    set: { drink: "Coffee", milk: "No milk", sweetness: "No sugar", strength: "Extra strong" },
    note: "Kopitiams don't make espresso. This is the closest: thick black coffee with no water added.",
  },
  {
    type: "drink",
    phrases: ["latte", "flat white", "cappuccino", "coffee with milk"],
    set: { drink: "Coffee", milk: "Evaporated milk", sweetness: "No sugar" },
    note: "Kopitiams don't steam milk. Coffee with evaporated milk and no sugar is the closest to a latte.",
  },
  {
    type: "drink",
    phrases: ["black tea", "plain tea"],
    set: { drink: "Tea", milk: "No milk", sweetness: "No sugar" },
  },
  {
    type: "drink",
    phrases: ["iced tea", "ice tea"],
    set: { drink: "Tea", milk: "No milk", temperature: "Iced" },
    note: "Iced tea at a kopitiam comes sweet unless you say otherwise.",
  },
  { type: "drink", phrases: ["milk tea", "tea with milk"], set: { drink: "Tea" } },
  { type: "drink", phrases: ["ginger tea"], set: { drink: "Tea", extras: ["With ginger"] } },
  { type: "drink", phrases: ["hot chocolate", "chocolate milk", "chocolate", "milo"], set: { drink: "Milo" } },
  { type: "drink", phrases: ["coffee and tea", "coffee tea"], set: { drink: "Coffee + tea" } },
  { type: "drink", phrases: ["coffee", "kopi"], set: { drink: "Coffee" } },
  { type: "drink", phrases: ["tea", "teh"], set: { drink: "Tea" } },

  // Modifiers
  { type: "modifier", phrases: ["no sugar", "unsweetened", "sugar free", "without sugar"], set: { sweetness: "No sugar" } },
  { type: "modifier", phrases: ["less sweet", "less sugar", "half sugar", "not too sweet"], set: { sweetness: "Less sweet" } },
  { type: "modifier", phrases: ["extra sweet", "more sugar", "sweeter", "very sweet"], set: { sweetness: "Sweeter" } },
  { type: "modifier", phrases: ["extra strong", "very strong"], set: { strength: "Extra strong" } },
  { type: "modifier", phrases: ["strong", "stronger", "extra shot"], set: { strength: "Strong" } },
  { type: "modifier", phrases: ["weak", "weaker", "less strong"], set: { strength: "Weak" } },
  { type: "modifier", phrases: ["no ice", "without ice", "not iced", "not cold", "hold the ice"], set: { temperature: "Hot" } },
  { type: "modifier", phrases: ["not sweet", "no sweet"], set: { sweetness: "No sugar" } },
  { type: "modifier", phrases: ["iced", "ice", "cold", "with ice"], set: { temperature: "Iced" } },
  { type: "modifier", phrases: ["hot", "warm"], set: { temperature: "Hot" } },
  { type: "modifier", phrases: ["takeaway", "take away", "to go", "takeout", "take out"], set: { extras: ["Takeaway"] } },
  { type: "modifier", phrases: ["no milk", "without milk", "black"], set: { milk: "No milk" } },
  { type: "modifier", phrases: ["evaporated milk", "fresh milk"], set: { milk: "Evaporated milk" } },
  { type: "modifier", phrases: ["condensed milk", "with milk"], set: { milk: "Condensed milk" } },
  { type: "modifier", phrases: ["frothy", "foamy", "pulled", "tarik"], set: { extras: ["Pulled"] } },
  { type: "modifier", phrases: ["ginger"], set: { extras: ["With ginger"] } },
];