export const sparkles = [
  "✦",
  "✧",
  "★",
  "☆",
  "✶",
  "✷",
  "❋",
  "✺",
  "✹",
  "✵",
  "❂",
  "✿",
  "❀",
  "✾",
  "❁",
  "⁂",
  "※",
  "⚝",
  "✡",
  "⛤",
];

export const getSparkle = (index: number) => sparkles[index % sparkles.length];

export const getRandomSparkle = () =>
  sparkles[Math.floor(Math.random() * sparkles.length)];
