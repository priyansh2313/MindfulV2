// src/components/FloatingChatbot.tsx

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "../styles/FloatingChatbot.module.css";
import MindfulChat from "./MindfulChat";

type FloatingChatbotProps = {
  isOpen: boolean;
  onToggle: () => void;
  hoveredSection: string | null;
  mode: "dashboard" | "evaluation" | "exercise" | "assistant";
  chatbotMessages?: string[];
  setChatbotMessages?: React.Dispatch<React.SetStateAction<string[]>>;
};

const tips = [
  "Remember to breathe deeply 🌬️",
  "You are enough, just as you are 💖",
  "Take a 5-second pause and smile 🙂",
  "Let go of tension in your shoulders 🧘‍♀️",
  "You're doing better than you think 💪",
];

export default function FloatingChatbot({
  isOpen,
  onToggle,
  hoveredSection,
  mode,
  chatbotMessages,
}: FloatingChatbotProps) {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [shapeClass, setShapeClass] = useState("shapeCircle");

  useEffect(() => {
    const shapes = ["shapeCircle", "shapePill", "shapeSquircle", "shapeDiamond"];
    const interval = setInterval(() => {
      const next = shapes[Math.floor(Math.random() * shapes.length)];
      setShapeClass(next);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode === "dashboard") {
      const tipInterval = setInterval(() => {
        const random = tips[Math.floor(Math.random() * tips.length)];
        setCurrentTip(random);
        setShowTip(true);
        setTimeout(() => setShowTip(false), 5000);
      }, 12000);
      return () => clearInterval(tipInterval);
    }
  }, [mode]);

  return (
    <div className={styles.chatbotWrapper}>
      {/* Chat window */}
      {isOpen && (
        <div
          className={`
            ${styles.chatWindow}
            ${mode === "evaluation" ? styles.evaluationMode : ""}
          `}
        >
          <div className={styles.chatHeader}>
            <h3>
              {mode === "evaluation"
                ? "🚨 Urgent Support"
                : mode === "dashboard"
                ? "👌 Mindful Bot"
                : mode === "exercise"
                ? "🧘‍♀️ Mindfulness Guide"
                : mode === "assistant"
                ? "🤖 Mindful Assistant Guide"
                : "💬 Mindful Bot"}
            </h3>
            <button onClick={onToggle} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>

          {/* Assistant mode with predefined messages */}
          {mode === "assistant" && chatbotMessages && chatbotMessages.length > 0 ? (
            <div className={styles.chatContent}>
              {chatbotMessages.map((msg, idx) => (
                <div key={idx} className={styles.botMessage}>
                  {msg}
                </div>
              ))}
            </div>
          ) : (
            <MindfulChat mode={mode} />
          )}
        </div>
      )}

      {/* Floating orb */}
      <div
        className={`${styles.avatarAssistant} ${styles[shapeClass]} ${
          hoveredSection && mode === "dashboard" ? styles.pulse : ""
        }`}
        onClick={onToggle}
        title={
          mode === "dashboard"
            ? "Need support?"
            : mode === "exercise"
            ? "Start Mindfulness"
            : mode === "assistant"
            ? "Ask for guidance"
            : "Emergency support"
        }
      >
        🧠
        {hoveredSection && mode === "dashboard" ? (
          <div className={styles.tipBubble}>
            {`Thinking about ${hoveredSection.toLowerCase()}?`}
          </div>
        ) : (
          showTip &&
          mode === "dashboard" && (
            <div className={styles.tipBubble}>{currentTip}</div>
          )
        )}
      </div>
    </div>
  );
}
