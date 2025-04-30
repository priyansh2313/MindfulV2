import React, { useState } from "react";
import styles from "../styles/TextSentiment.module.css";

const TextSentiment = ({ onMoodDetected }: { onMoodDetected: (mood: string) => void }) => {
  const [text, setText] = useState("");

  const analyzeSentiment = (input: string): string => {
    const lower = input.toLowerCase();
    if (/(sad|tired|upset|depressed|angry|bad|hate)/.test(lower)) return "sad";
    if (/(happy|grateful|love|joy|peace|calm)/.test(lower)) return "happy";
    return "neutral";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mood = analyzeSentiment(text);
    onMoodDetected(mood); // ✅ Only inform parent
    setText(""); // Optional: clear text after submit
  };

  return (
    <div className={styles.textWrapper}>
      <h3 className={styles.heading}>📝 How do you feel in words?</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your thoughts here..."
          className={styles.textarea}
          maxLength={300}
        />
        <div className={styles.feedbackRow}>
          <span className={styles.charCount}>{text.length}/300</span>
          <button type="submit" className={styles.analyzeBtn}>
            ✨ Analyze Mood
          </button>
        </div>
      </form>

      {/* ✅ Remove showing result */}
      {/* Just keep typing experience clean */}
      <p className={styles.analyzingText}>🧠 Analyzing your thoughts...</p> 
    </div>
  );
};

export default TextSentiment;
