import { MoodDNA } from "./generateMoodDNA";

export interface CompositionSection {
  name: string;
  start: number;
  duration: number;
  melody: string[];
  instruments: string[];
}

export interface CompositionPlan {
  genre: string;
  tempo: number;
  scale: string[];
  chords: string[][];
  sections: CompositionSection[];
}

export function generateCompositionPlan(moodDNA: MoodDNA): CompositionPlan {
  const { mood, brightness, colorEnergy, complexity } = moodDNA;

  const isHappy = mood.includes("happy");
  const isCalm = mood.includes("calm");
  const isSad = mood.includes("sad");

  const scale = brightness > 128
    ? ["C4", "D4", "E4", "G4", "A4"]
    : ["C4", "Eb4", "F4", "G4", "Bb4"];

  const chords = brightness > 128
    ? [["C4", "E4", "G4"], ["F4", "A4", "C5"], ["G4", "B4", "D5"]]
    : [["Am"], ["Dm"], ["F"]];

  const tempo = 60 + Math.floor(colorEnergy / 4); // 60–120 bpm

  const genre = isHappy
    ? "chillpop"
    : isSad
    ? "ambient"
    : isCalm
    ? "lofi"
    : "cinematic";

  const complexityLevel = Math.round(complexity * 3);

  // Unique melodies per section
  const introMelody = [scale[0], scale[1], scale[2]];
  const verseMelody = [...scale].slice(0, 3 + complexityLevel);
  const chorusMelody = [...scale].slice().reverse();

  const sections: CompositionSection[] = [
    {
      name: "intro",
      start: 0,
      duration: 5,
      melody: introMelody,
      instruments: ["piano"],
    },
    {
      name: "verse",
      start: 5,
      duration: 10,
      melody: verseMelody,
      instruments: ["piano", "guitar", "drums"],
    },
    {
      name: "chorus",
      start: 15,
      duration: 10,
      melody: chorusMelody,
      instruments: ["piano", "guitar", "drums"],
    },
    {
      name: "outro",
      start: 25,
      duration: 5,
      melody: [scale[0], scale[1]],
      instruments: ["piano"],
    },
  ];

  return {
    genre,
    tempo,
    scale,
    chords,
    sections,
  };
}
