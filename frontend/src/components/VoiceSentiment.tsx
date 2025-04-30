import React, { useEffect, useState } from "react";
import styles from "../styles/VoiceSentiment.module.css";

// Extend the Window interface to include SpeechRecognition
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

const VoiceSentiment = ({ onMoodDetected }: { onMoodDetected: (mood: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (!isListening) return;

    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);

      const mood = analyzeSpeechMood(speechToText);
      onMoodDetected(mood); // ✅ Only send mood to parent
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.start();

    return () => recognition.abort();
  }, [isListening, onMoodDetected]);

  const analyzeSpeechMood = (input: string): string => {
    const lower = input.toLowerCase();
    if (/(sad|tired|upset|depressed|angry|bad|hate)/.test(lower)) return "sad";
    if (/(happy|grateful|love|joy|peace|calm)/.test(lower)) return "happy";
    return "neutral";
  };

  const handleStartListening = () => {
    setIsListening(true);
  };

  return (
    <div className={styles.voiceWrapper}>
      <h3 className={styles.heading}>🎤 Speak your feelings aloud</h3>

      {!isListening ? (
        <button onClick={handleStartListening} className={styles.listenBtn}>
          🎙️ Start Listening
        </button>
      ) : (
        <div className={styles.listeningSection}>
          <p className={styles.listeningText}>🎧 Listening to your voice...</p>
          <div className={styles.wave}></div> {/* optional animation */}
        </div>
      )}
    </div>
  );
};

export default VoiceSentiment;
