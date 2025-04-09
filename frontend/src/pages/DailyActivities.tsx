import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../styles/DailyActivities.module.css";



const breathingExercises = [
  {
    id: 1,
    activity: "Box Breathing",
    pattern: [4, 4, 4, 4],
    phases: ["Inhale", "Hold", "Exhale", "Hold"],
    description: "Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s.",
  },
  {
    id: 2,
    activity: "4-7-8 Breathing",
    pattern: [4, 7, 8],
    phases: ["Inhale", "Hold", "Exhale"],
    description: "Inhale for 4s, hold for 7s, exhale for 8s.",
  },
  {
    id: 3,
    activity: "Alternate Nostril Breathing",
    pattern: [4, 4, 4, 4],
    phases: ["Inhale (Left)", "Hold", "Exhale (Right)", "Hold"],
    description: "Breathe in through one nostril, hold, then exhale through the other nostril.",
  },
];

const affirmations = [
  "I am enough.",
  "I deserve love and respect.",
  "I am stronger than my struggles.",
  "My challenges help me grow.",
];

const DailyActivities = () => {
  const [currentExercise, setCurrentExercise] = useState(breathingExercises[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timer, setTimer] = useState(currentExercise.pattern[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [gratitude, setGratitude] = useState("");


  useEffect(() => {
    if (!isBreathing) return;

    const timeout = setTimeout(() => {
      const nextIndex = (phaseIndex + 1) % currentExercise.pattern.length;
      setPhaseIndex(nextIndex);
      setTimer(currentExercise.pattern[nextIndex]);
    }, timer * 1000);

    return () => clearTimeout(timeout);
  }, [isBreathing, phaseIndex, timer, currentExercise]);

  const handleExerciseChange = (exercise) => {
    setIsBreathing(false);
    setCurrentExercise(exercise);
    setPhaseIndex(0);
    setTimer(exercise.pattern[0]);
    playClick();
  };

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
    playClick();
  };

  return (
    <div className={styles.container}>
      <motion.h1 className={styles.title} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        🌿 Daily Mindfulness Activities
      </motion.h1>

      {/* Breathing Animation */}
      <motion.div
        animate={{ scale: isBreathing ? [1, 1.3, 1] : 1 }}
        transition={{ duration: timer, repeat: Infinity, ease: "easeInOut" }}
        className={styles.breathingBubble}
      >
        <motion.p className={styles.breathingText} key={phaseIndex}>
          {currentExercise.phases[phaseIndex]}
        </motion.p>
      </motion.div>

      <div className={styles.card}>
        <h2>{currentExercise.activity}</h2>
        <p>{currentExercise.description}</p>
        <p className={styles.timer}>{timer}s</p>
        <motion.button
          onClick={() => setIsBreathing((prev) => !prev)}
          className={`${styles.button} ${isBreathing ? styles.stop : styles.start}`}
          whileHover={{ scale: 1.1 }}
        >
          {isBreathing ? "Stop" : "Start"} Breathing
        </motion.button>
      </div>

      <div className={styles.exerciseSelector}>
        {breathingExercises.map((ex) => (
          <motion.button
            key={ex.id}
            onClick={() => handleExerciseChange(ex)}
            className={`${styles.button} ${currentExercise.id === ex.id ? styles.active : ""}`}
            whileHover={{ scale: 1.1 }}
          >
            {ex.activity}
          </motion.button>
        ))}
      </div>

      <div className={styles.card}>
        <h2>🌍 Grounding (For Anxiety)</h2>
        <p>Think of 5 things you see, 4 you can touch, 3 you hear, 2 you can smell, 1 you can taste.</p>
      </div>

      <div className={styles.card}>
        <h2>🧘 Body Scan Meditation (For Stress & Insomnia)</h2>
        <p>Close your eyes. Bring awareness from your toes all the way up to your head, slowly and gently.</p>
      </div>

      <div className={styles.card}>
        <h2>💛 Gratitude Check-in (Loneliness, Depression)</h2>
        <textarea
          placeholder="Write 3 things you're grateful for..."
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          className={styles.textarea}
        />
      </div>

      <div className={styles.card}>
        <h2>✨ Affirmation Practice (Self-esteem, Depression)</h2>
        <p className={styles.affirmation}>{affirmations[affirmationIndex]}</p>
        <button className={styles.button} onClick={nextAffirmation}>
          Next Affirmation
        </button>
      </div>
    </div>
  );
};

export default DailyActivities;
