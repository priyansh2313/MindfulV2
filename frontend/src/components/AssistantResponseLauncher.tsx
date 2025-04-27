// src/components/AssistantResponseLauncher.tsx
import { motion } from "framer-motion";
import React from "react";
import styles from "../styles/MindfulAssistant.module.css";
import { FusedMood } from "../utils/fuseFuzzyMood";

interface Props {
  mood: FusedMood;
}

const moodResponses: Record<FusedMood, string> = {
  happy: "That's wonderful! Keep riding that wave of positivity 🌈",
  sad: "It's okay to feel sad. Take a deep breath, you're not alone 🌧️",
  angry: "Try to take a pause. Maybe a grounding exercise will help 🌿",
  surprised: "That caught you off guard? Let's explore what happened ✨",
  neutral: "You're feeling steady. Let's gently tune in to your thoughts ☁️",
};

const AssistantResponseLauncher = ({ mood }: Props) => {
  return (
    <motion.div
      className={styles.assistantResponseBox}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h3 className={styles.assistantHeading}>💬 Assistant Says:</h3>
      <p className={styles.assistantResponse}>{moodResponses[mood]}</p>
    </motion.div>
  );
};

export default AssistantResponseLauncher;
