
import { saveAs } from "file-saver";
import * as Tone from "tone";

// Instruments
let piano: Tone.PolySynth;
let pad: Tone.PolySynth;
let guitar: Tone.MonoSynth;
let drums: Tone.MembraneSynth;
let recorder: Tone.Recorder;
let isPlaying = false;

// Stop and reset
export const stopMusicEnhanced = async () => {
  if (isPlaying) {
    await Tone.Transport.stop();
    Tone.Transport.cancel();
    piano?.dispose();
    pad?.dispose();
    guitar?.dispose();
    drums?.dispose();
    recorder?.dispose();
    isPlaying = false;
  }
};

export const generateMusicEnhanced = async (
  moodDNA,
  onVisualUpdate
) => {
  await Tone.start();
  await stopMusicEnhanced();

  isPlaying = true;

  // Instruments
  piano = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 1.5 },
  }).toDestination();

  pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 1, decay: 1, sustain: 0.3, release: 3 },
  }).toDestination();

  guitar = new Tone.MonoSynth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.4 },
  }).toDestination();

  drums = new Tone.MembraneSynth().toDestination();
  recorder = new Tone.Recorder();

  // Connect to recorder
  piano.connect(recorder);
  pad.connect(recorder);
  guitar.connect(recorder);
  drums.connect(recorder);

  await recorder.start();

  // Tempo
  Tone.Transport.bpm.value = moodDNA.tempo || 120;

  const scale = moodDNA.scale || ["C4", "E4", "G4", "A4"];
  let beat = 0;

  Tone.Transport.scheduleRepeat((time) => {
    const note = scale[beat % scale.length];
    piano.triggerAttackRelease(note, "8n", time);
    if (beat % 2 === 0) drums.triggerAttackRelease("C2", "8n", time);
    if (beat % 4 === 2) guitar.triggerAttackRelease("G2", "8n", time);
    beat++;
  }, "4n");

  Tone.Transport.scheduleRepeat(() => {
    const freqData = new Float32Array(128);
    if (onVisualUpdate) onVisualUpdate(freqData);
  }, "8n");

  await Tone.Transport.start();
};

// Download audio
export const exportMP3 = async () => {
  const recording = await recorder.stop();
  const url = URL.createObjectURL(recording);
  const blob = new Blob([await recording.arrayBuffer()], { type: "audio/mp3" });
  saveAs(blob, "generated_melody.mp3");
};
