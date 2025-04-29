// src/components/VoiceWaveformMic.tsx
import React, { useRef, useState } from "react";
import styles from "../styles/VoiceSentiment.module.css";

const VoiceWaveformMic = ({ onMoodDetected }: { onMoodDetected: (mood: string) => void }) => {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Idle");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !analyserRef.current || !dataArrayRef.current) return;

    const draw = () => {
      requestAnimationFrame(draw);
      analyserRef.current?.getByteTimeDomainData(dataArrayRef.current!);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#7c3aed";

      const sliceWidth = canvas.width / dataArrayRef.current.length;
      let x = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = (v * canvas.height) / 2;

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    };
    draw();
  };

  const startRecording = async () => {
    setStatus("Recording...");
    setRecording(true);
    audioContextRef.current = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const source = audioContextRef.current.createMediaStreamSource(stream);
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    drawWaveform();

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = handleStop;
    recorder.start();
    mediaRecorderRef.current = recorder;
  };

  const stopRecording = () => {
    setRecording(false);
    setStatus("Analyzing...");
    mediaRecorderRef.current?.stop();
  };

  const handleStop = async () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];
    const mood = await analyzeAudioHeuristically(blob);
    setStatus(`Detected: ${mood}`);
    onMoodDetected(mood);
  };

  const analyzeAudioHeuristically = async (blob: Blob): Promise<string> => {
    const audioCtx = new AudioContext();
    const buffer = await blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(buffer);
    const rawData = audioBuffer.getChannelData(0);
    const rms = Math.sqrt(rawData.reduce((acc, v) => acc + v * v, 0) / rawData.length);

    if (rms > 0.05) return "anxious";
    if (rms < 0.015) return "calm";
    return "neutral";
  };

  return (
    <div className={styles.voiceContainer}>
      <h3>🎙 Voice Check</h3>
      <p className={styles.status}>{status}</p>
      <canvas ref={canvasRef} className={styles.waveform}></canvas>
      <button
        className={`${styles.micButton} ${recording ? styles.recording : ""}`}
        onClick={recording ? stopRecording : startRecording}
      >
        <span role="img" aria-label="mic">🎤</span>
      </button>
    </div>
  );
};

export default VoiceWaveformMic;
