import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "../styles/FloatingChatbot.module.css";
import MindfulChat from "./MindfulChat";

type FloatingChatbotProps = {
  isOpen: boolean;
  onToggle: () => void;
  hoveredSection: string | null;
};


const tips = [
  "Remember to breathe deeply 🌬️",
  "You are enough, just as you are 💖",
  "Take a 5-second pause and smile 🙂",
  "Let go of tension in your shoulders 🧘‍♀️",
  "You're doing better than you think 💪",
];

export default function FloatingChatbot({ isOpen, onToggle, hoveredSection }: FloatingChatbotProps) {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(tips[0]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      const random = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(random);
      setShowTip(true);
      setTimeout(() => setShowTip(false), 5000); // Hide tip after 5s
    }, 12000); // Show new tip every 12s
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className={styles.chatbotWrapper}>
      {/* Chat window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>💬 Mindful Bot</h3>
            <button onClick={onToggle} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
          <MindfulChat />
        </div>
      )}

      {/* Assistant Orb */}
      <div
  className={`${styles.avatarAssistant} ${hoveredSection ? styles.pulse : ''}`}
  onClick={onToggle}
  title="Need support?"
>
  🧠
  {hoveredSection ? (
    <div className={styles.tipBubble}>
      {`Thinking about ${hoveredSection.toLowerCase()}?`}
    </div>
  ) : (
    showTip && <div className={styles.tipBubble}>{currentTip}</div>
  )}
</div>
    </div>
  );
}
