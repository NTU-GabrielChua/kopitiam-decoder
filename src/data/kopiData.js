// Every term the decoder understands.
// "aliases" are the spellings people actually type (lowercase, words separated by spaces).
// "category" says which part of the drink the term changes.

export const TERMS = [
  // Drinks
  { aliases: ["kopi"], category: "drink", value: "Coffee", meaning: "Coffee", say: "koh-pee" },
  { aliases: ["teh"], category: "drink", value: "Tea", meaning: "Tea", say: "teh" },
  { aliases: ["milo"], category: "drink", value: "Milo", meaning: "Milo (chocolate malt)", say: "my-loh" },
  { aliases: ["yuan yang", "cham"], category: "drink", value: "Coffee + tea", meaning: "Coffee and tea mixed", say: "yoo-en yang / chum" },

  // Milk
  { aliases: ["o"], category: "milk", value: "No milk", meaning: "No milk (black)", say: "oh" },
  { aliases: ["c", "see"], category: "milk", value: "Evaporated milk", meaning: "With evaporated milk instead of condensed", say: "see" },

  // Sweetness
  { aliases: ["kosong"], category: "sweetness", value: "No sugar", meaning: "No sugar", say: "koh-song" },
  { aliases: ["siew dai", "siu dai", "siew tai"], category: "sweetness", value: "Less sweet", meaning: "Less sugar", say: "see-oo dye" },
  { aliases: ["gah dai", "ga dai", "ka dai"], category: "sweetness", value: "Sweeter", meaning: "Extra sugar", say: "gah dye" },

  // Strength
  { aliases: ["po"], category: "strength", value: "Weak", meaning: "Weaker (more water)", say: "poh" },
  { aliases: ["gao", "gau", "kau"], category: "strength", value: "Strong", meaning: "Stronger (less water)", say: "gow" },
  { aliases: ["di lo", "di lu", "dilo"], category: "strength", value: "Extra strong", meaning: "Extra strong (no water added)", say: "dee loh" },

  // Temperature
  { aliases: ["peng", "beng", "ice", "iced"], category: "temperature", value: "Iced", meaning: "With ice", say: "peng" },

  // Extras
  { aliases: ["tarik"], category: "extra", value: "Pulled", meaning: "Pulled between cups until frothy", say: "tah-rick" },
  { aliases: ["halia"], category: "extra", value: "With ginger", meaning: "With ginger", say: "hah-lee-ah" },
  { aliases: ["da bao", "dabao", "tapau", "ta pau", "bao"], category: "extra", value: "Takeaway", meaning: "Takeaway", say: "dah bow" },
];

// What you get if the order doesn't say otherwise.
export const DEFAULTS = {
  drink: null,
  milk: "Condensed milk",
  sweetness: "Normal",
  strength: "Normal",
  temperature: "Hot",
};