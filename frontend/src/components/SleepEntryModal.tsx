// src/components/SleepEntryModal.tsx
import React, { useState } from "react";
import styles from "../styles/SleepEntryModal.module.css";

const SleepEntryModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (start: string, end: string) => void }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = () => {
    if (startTime && endTime) {
      onSubmit(startTime, endTime);
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>🛌 Manual Sleep Entry</h2>
        <label>Sleep Start:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <label>Sleep End:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <div className={styles.modalButtons}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose} className={styles.cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SleepEntryModal;
