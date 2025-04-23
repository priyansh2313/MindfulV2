// src/components/FloatingChatbot.tsx
import { MessageSquareHeart, X } from "lucide-react";
import React from "react";
import styles from "../styles/FloatingChatbot.module.css";
import MindfulChat from "./MindfulChat";

type FloatingChatbotProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function FloatingChatbot({ isOpen, onToggle }: FloatingChatbotProps) {
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

      {/* Floating icon */}
      <button className={styles.floatingButton} onClick={onToggle}>
        <MessageSquareHeart size={28} />
      </button>
    </div>
  );
}
