// useMusic.ts
import * as Tone from "tone";

let synth: Tone.PolySynth;
let ambientPad: Tone.Synth;
let loop: Tone.Loop;

export async function generateMusic(mood: string, colors: number[][]) {
  await Tone.start();
  console.log("Tone.js AudioContext started");

  // Clear previous music
  stopMusic();

  synth = new Tone.PolySynth().toDestination();
  ambientPad = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 2,
      decay: 1,
      sustain: 0.5,
      release: 5,
    },
  }).toDestination();

  const colorIntensity = Math.floor(
    colors.reduce((acc, curr) => acc + curr[0] + curr[1] + curr[2], 0) /
    (colors.length * 3)
  );

  const notes = getMoodNotes(mood, colorIntensity);

  // Background ambient pad
  ambientPad.triggerAttackRelease("C4", "8n");

  // Melody loop
  loop = new Tone.Loop((time) => {
    const note = notes[Math.floor(Math.random() * notes.length)];
    synth.triggerAttackRelease(note, "8n", time);
  }, "0.5");

  loop.start(0);
  Tone.Transport.start();
}

export function stopMusic() {
  if (loop) loop.stop();
  if (synth) synth.disconnect();
  if (ambientPad) ambientPad.disconnect();
  Tone.Transport.stop();
}

function getMoodNotes(mood: string, intensity: number): string[] {
  const chill = ["C4", "E4", "G4", "A4", "B4", "C5"];
  const energetic = ["D4", "F4", "A4", "B4", "C5"];
  const dark = ["C3", "Eb3", "G3", "Bb3", "C4"];
  const happy = ["E4", "G#4", "B4", "C#5", "E5"];

  if (mood.includes("dog") || mood.includes("cat") || mood.includes("happy")) return happy;
  if (mood.includes("person") || mood.includes("sad") || intensity < 100) return dark;
  if (mood.includes("nature") || mood.includes("landscape")) return chill;

  return energetic;
}
