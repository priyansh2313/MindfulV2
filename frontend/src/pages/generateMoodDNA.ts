// frontend/src/utils/generateMoodDNA.ts
export interface MoodDNA {
  mood: string;
  colorEnergy: number;
  warmth: number;
  brightness: number;
  complexity: number;
}

export function generateMoodDNA(mood: string, colors: number[][]): MoodDNA {
  // Average brightness, warmth and complexity
  const brightness = colors.reduce((acc, c) => acc + (c[0] + c[1] + c[2]) / 3, 0) / colors.length;
  const warmth = colors.reduce((acc, c) => acc + (c[0] - c[2]), 0) / colors.length;
  const complexity = Math.min(1, colors.length / 5); // assuming 5 max swatches
  const colorEnergy = brightness + warmth;

  return {
    mood: mood.toLowerCase(),
    colorEnergy,
    warmth,
    brightness,
    complexity,
  };
}
