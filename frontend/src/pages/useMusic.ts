import * as Tone from "tone";
import { generateMoodDNA } from "./generateMoodDNA";

let synth: Tone.PolySynth;
let padSynth: Tone.Synth;
let drum: Tone.MembraneSynth;
let melodyPart: Tone.Sequence;
let padLoop: Tone.Loop;

export async function generateMusic(mood: string, colors: number[][]) {
  await Tone.start();

  const dna = generateMoodDNA(colors, mood);
  console.log("🎼 Mood DNA:", dna);

  Tone.Transport.bpm.value = dna.tempo;

  // Synthesizer
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  synth.set({
    oscillator: { type: dna.scale === "minor" ? "triangle" : "sine" },
    envelope: {
      attack: 0.5,
      decay: 0.1,
      sustain: 0.5,
      release: 1,
    },
  });

  // Pad
  padSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 4,
      decay: 1,
      sustain: 0.5,
      release: 6,
    },
  }).toDestination();

  // Drums (optional)
  drum = new Tone.MembraneSynth().toDestination();

  // Pad Loop
  padLoop = new Tone.Loop((time) => {
    const padNote = `${dna.key}2`;
    padSynth.triggerAttackRelease(padNote, "8n", time);
  }, "4m").start(0);

  // Melody Notes
  const scaleMap: { [key: string]: string[] } = {
    major: ["C", "D", "E", "G", "A"],
    minor: ["C", "D", "D#", "G", "A#"],
  };
  const notes = scaleMap[dna.scale].map((n) => n.replace("C", dna.key)); // key adjusted

  const melody = Array.from({ length: 8 }, () =>
    `${notes[Math.floor(Math.random() * notes.length)]}${Math.random() > 0.5 ? "4" : "5"}`
  );

  melodyPart = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, "8n", time);
  }, melody, "4n").start(0);

  Tone.Transport.start();
}

export function stopMusic() {
  Tone.Transport.stop();
  Tone.Transport.cancel();

  if (melodyPart) melodyPart.dispose();
  if (padLoop) padLoop.dispose();
  if (synth) synth.dispose();
  if (padSynth) padSynth.dispose();
  if (drum) drum.dispose();
}
