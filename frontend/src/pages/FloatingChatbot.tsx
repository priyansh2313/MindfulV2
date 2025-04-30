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
  "Remember to breathe deeply \ud83c\udf2c\ufe0f",
  "You are enough, just as you are \ud83d\udc96",
  "Take a 5-second pause and smile \ud83d\ude42",
  "Let go of tension in your shoulders \ud83e\uddd8\u200d\u2640\ufe0f",
  "You're doing better than you think \ud83d\udcaa",
];

export default function FloatingChatbot({ isOpen, onToggle, hoveredSection, mode, chatbotMessages }: FloatingChatbotProps) {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [shapeClass, setShapeClass] = useState("shapeCircle");
  const [ setHoveredSection] = useState("encyclopedia");


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
                ? "\ud83d\udea8 Urgent Support":
                mode === "dashboard"
                ? "\ud83d\udc4c Mindful Bot"
                : mode === "exercise"
                ? "\ud83e\uddd8\u200d\u2640\ufe0f Mindfulness Guide"
                : mode === "assistant"
                ? "\ud83e\udd16 Mindful Assistant Guide"
                : "\ud83d\udcac Mindful Bot"}
            </h3>
            <button onClick={onToggle} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>

          {/* \ud83d\udc47 If assistant mode, show guiding messages */}
          {mode === "assistant" && chatbotMessages && chatbotMessages.length > 0 ? (
            <div className={styles.chatContent}>
              {chatbotMessages.map((msg, idx) => (
                <div key={idx} className={styles.botMessage}>
                  {msg}
                </div>
              ))}
            </div>
          ) : (
            <MindfulChat mode={mode} setInstructorMode={() => {}} />
          )}
        </div>
      )}

      {/* \ud83e\udde0 Assistant Floating Orb */}
      <div
        className={`${styles.avatarAssistant} ${styles[shapeClass]} ${hoveredSection && mode === "dashboard" ? styles.pulse : ''}`}
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
      >🧠
        {hoveredSection && mode === "dashboard" ? (
          <div className={styles.tipBubble}>
            {`Thinking about ${hoveredSection.toLowerCase()}?`}
          </div>
        ) : (
          showTip && mode === "dashboard" && (
            <div className={styles.tipBubble}>
              {currentTip}
            </div>
          )
        )}
      </div>
    </div>
  );
}
