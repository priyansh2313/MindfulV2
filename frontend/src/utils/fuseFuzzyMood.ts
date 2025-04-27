// src/utils/fuseFuzzyMood.ts

export type Mood = "happy" | "neutral" | "sad" | "angry" | "anxious" | "calm";
export type FusedMood = "stable" | "low" | "crisis" | "irritated" | "elevated";

/**
 * Fuses multiple emotion inputs (face, voice, text) using simple fuzzy logic rules.
 */
export function fuseFuzzyMood(
  face: Mood,
  voice: Mood,
  text: Mood
): FusedMood {
  if (
    (face === "sad" || face === "angry") &&
    voice === "anxious" &&
    (text === "angry" || text === "sad")
  ) {
    return "crisis";
  }

  if ((face === "sad" || voice === "sad") && text !== "happy") {
    return "low";
  }

  if ((face === "angry" || voice === "angry") && text !== "calm") {
    return "irritated";
  }

  if (voice === "anxious" && (face === "neutral" || text === "neutral")) {
    return "elevated";
  }

  return "stable";
}
