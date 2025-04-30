// ✅ DailyActivities.tsx (Final polished version)

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import FloatingChatbot from "../pages/FloatingChatbot"; // ✅ Import FloatingChatbot
import styles from "../styles/DailyActivities.module.css";


const breathingExercises = [
  {
    id: 1,
    activity: "Box Breathing",
    pattern: [4, 4, 4, 4],
    phases: ["Inhale", "Hold", "Exhale", "Hold"],
  },
  {
    id: 2,
    activity: "4-7-8 Breathing",
    pattern: [4, 7, 8],
    phases: ["Inhale", "Hold", "Exhale"],
  },
  {
    id: 3,
    activity: "Alternate Nostril Breathing",
    pattern: [4, 4, 4, 4],
    phases: ["Inhale Left", "Hold", "Exhale Right", "Hold"],
  },
];

const affirmations = [
  "I am grounded and calm.",
  "I release tension with every breath.",
  "Peace flows through me.",
  "I am present in this moment.",
];

export default function DailyActivities() {
  const [currentExercise, setCurrentExercise] = useState(breathingExercises[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timer, setTimer] = useState(currentExercise.pattern[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [gratitude, setGratitude] = useState("");
  const [chatbotOpen, setChatbotOpen] = useState(true); // ✅ Added for chatbot open/close


  useEffect(() => {
    if (!isBreathing) return;
    const timeout = setTimeout(() => {
      const next = (phaseIndex + 1) % currentExercise.pattern.length;
      setPhaseIndex(next);
      setTimer(currentExercise.pattern[next]);
    }, timer * 1000);
    return () => clearTimeout(timeout);
  }, [phaseIndex, timer, isBreathing, currentExercise]);

  const handleExerciseChange = (ex) => {
    setIsBreathing(false);
    setCurrentExercise(ex);
    setPhaseIndex(0);
    setTimer(ex.pattern[0]);
  };

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className={styles.wrapper}>
      {/* 🧘 Floating Chatbot for Mindful Guidance */}
      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen((prev) => !prev)}
        hoveredSection={null}
        mode="exercise" // ✅ Important: mode is "exercise"
      />



    <motion.h1 className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      🧘 Daily Mindfulness
    </motion.h1>

      <motion.div
        className={styles.breathingCircle}
        animate={{ scale: isBreathing ? [1, 1.3, 1] : 1 }}
        transition={{ duration: timer, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className={styles.phaseText}>{currentExercise.phases[phaseIndex]}</p>
        <p className={styles.timer}>{timer}s</p>
      </motion.div>

      <div className={styles.exerciseSwitcher}>
        {breathingExercises.map((ex) => (
          <button
            key={ex.id}
            onClick={() => handleExerciseChange(ex)}
            className={`${styles.exerciseButton} ${ex.id === currentExercise.id ? styles.active : ""}`}
          >
            {ex.activity}
          </button>
        ))}
        <button onClick={() => setIsBreathing((prev) => !prev)} className={styles.breathingToggle}>
          {isBreathing ? "Pause" : "Start"}
        </button>
      </div>

      <motion.div className={styles.section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <h2>🌿 Grounding Technique</h2>
        <p>5 things you see • 4 touch • 3 hear • 2 smell • 1 taste</p>
      </motion.div>

      <motion.div className={styles.section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <h2>🌀 Body Scan</h2>
        <p>Close your eyes, and move your awareness from toes to head slowly.</p>
      </motion.div>

      <motion.div className={styles.affirmationBox} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <p className={styles.affirmation}>{affirmations[affirmationIndex]}</p>
        <button className={styles.exerciseButton} onClick={nextAffirmation}>Next</button>
      </motion.div>

      <motion.div className={styles.gratitude} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <h2>🌸 Gratitude Reflection</h2>
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="Write 3 things you're grateful for today..."
        />
        {gratitude.length > 5 && (
          <p style={{ color: "#2a9d8f", marginTop: "1rem" }}>
            🌟 Thank you for reflecting today.
          </p>
        )}
      </motion.div>
    </div>
  );
}