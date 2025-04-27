// src/pages/MindfulAssistantFusion.tsx
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import AssistantResponseLauncher from "../components/AssistantResponseLauncher";
import EmotionClassifierFaceAPI from "../components/EmotionClassifierFaceMood";
import TextSentiment from "../components/TextSentiment";
import VoiceSentiment from "../components/VoiceSentiment";
import styles from "../styles/MindfulAssistant.module.css";
import { FusedMood, fuseFuzzyMood } from "../utils/fuseFuzzyMood";

const steps = ["Face", "Voice", "Text", "Result"];

const MindfulAssistantFusion = () => {
  const [step, setStep] = useState(1);
  const [faceMood, setFaceMood] = useState("neutral");
  const [voiceMood, setVoiceMood] = useState("neutral");
  const [textMood, setTextMood] = useState("neutral");
  const [finalMood, setFinalMood] = useState<FusedMood | null>(null);
  const [hasFaceInput, setHasFaceInput] = useState(false);
  const [hasVoiceInput, setHasVoiceInput] = useState(false);
  const [hasTextInput, setHasTextInput] = useState(false);

  const handleFaceDetected = (mood: string) => {
    setFaceMood(mood);
    setHasFaceInput(true);
  };

  const handleVoiceDetected = (mood: string) => {
    setVoiceMood(mood);
    setHasVoiceInput(true);
  };

  const handleTextDetected = (mood: string) => {
    setTextMood(mood);
    const result = fuseFuzzyMood(faceMood, voiceMood, mood);
    setFinalMood(result);
    setHasTextInput(true);
  };

  return (
    <div className={styles.container}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🧘 Mindful Assistant
      </motion.h1>

      <div className={styles.progressBar}>
        {steps.map((label, index) => (
          <div
            key={index}
            className={`${styles.progressStep} ${
              step - 1 >= index ? styles.activeStep : ""
            }`}
          >
            <span>{label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className={styles.moduleBox}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className={styles.prompt}>🧠 Show us how you feel</p>
            <EmotionClassifierFaceAPI onMoodDetected={handleFaceDetected} />
            {hasFaceInput && (
              <motion.button
                className={styles.continueButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            className={styles.moduleBox}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className={styles.prompt}>🎤 Tell us how you feel</p>
            <VoiceSentiment onMoodDetected={handleVoiceDetected} />
            {hasVoiceInput && (
              <motion.button
                className={styles.continueButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(3)}
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            className={styles.moduleBox}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className={styles.prompt}>📝 Write how you feel</p>
            <TextSentiment onMoodDetected={handleTextDetected} />
            {hasTextInput && finalMood && (
              <motion.button
                className={styles.continueButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(4)}
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 4 && finalMood && (
          <motion.div
            key="step4"
            className={styles.moduleBox}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.fusedResult}>
              <h2>🧬 Fused Mood: <span>{finalMood}</span></h2>
              <p>This is your combined emotion based on voice, text & face.</p>
            </div>

            <AssistantResponseLauncher mood={finalMood} />

            <div className={styles.reportBox}>
              <h3>🧾 Emotional Insight Report</h3>
              <ul>
                <li><strong>🎭 Face Mood:</strong> {faceMood}</li>
                <li><strong>🔊 Voice Mood:</strong> {voiceMood}</li>
                <li><strong>📝 Text Mood:</strong> {textMood}</li>
                <li><strong>🧬 Fused Mood:</strong> {finalMood}</li>
              </ul>
              <p className={styles.tipText}>
                Remember: Emotions are waves 🌊 — observe, breathe, and let them pass.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MindfulAssistantFusion;
