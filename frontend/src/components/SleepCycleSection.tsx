// DreamySleepTracker.tsx
"use client";

import React, { useState } from "react";
import styles from "../styles/SleepCycleSection.module.css";

interface SleepRecord {
  sleepScore: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

const SleepCycleSection = () => {
  const [sleepHours, setSleepHours] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [oratechSleep, setOratechSleep] = useState<SleepRecord | null>(null);
  const [loadingOraTech, setLoadingOraTech] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = Number((e.target as any).sleep.value);
    setSleepHours(hours);
    setSubmitted(true);
  };

  const getStatus = () => {
    if (sleepHours >= 8) return { label: "🌙 Deep Sleep", color: "#4ade80", tip: "Great job! Keep up the restful nights." };
    if (sleepHours >= 6) return { label: "😴 Well Rested", color: "#fde68a", tip: "Try to wind down earlier." };
    return { label: "😵 Sleep Deprived", color: "#f87171", tip: "Consider a calming night routine." };
  };

  const status = getStatus();

  // 🔥 Fetch real OraTech Sleep Data
  const handleUseOraTech = async () => {
    setLoadingOraTech(true);
    try {
      const res = await fetch("/api/oratech/sleep/today");
      const data = await res.json();
      setOratechSleep({
        sleepScore: data.sleepScore,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMinutes: data.durationMinutes,
      });
    } catch (error) {
      console.error("Failed to fetch OraTech data:", error);
    } finally {
      setLoadingOraTech(false);
    }
  };

  return (
    <div className={styles.dreamyContainer}>
      <div className={styles.overlay}></div>
      <h1 className={styles.heading}>🌙 Sleep Tracker and Analysis</h1>

      {/* If OraTech Sleep Data is fetched */}
      {oratechSleep ? (
        <div className={styles.resultBox}>
          <h2 className={styles.status} style={{ color: "#4ade80" }}>🌟 OraTech Sleep Data</h2>
          <p><strong>Sleep Score:</strong> {oratechSleep.sleepScore}</p>
          <p><strong>Start Time:</strong> {oratechSleep.startTime}</p>
          <p><strong>End Time:</strong> {oratechSleep.endTime}</p>
          <p><strong>Duration:</strong> {oratechSleep.durationMinutes} minutes</p>
          <button onClick={() => setOratechSleep(null)} className={styles.recordAgain}>Reset</button>
        </div>
      ) : (
        <>
          {/* Manual Sleep Hours Entry */}
          {!submitted && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="sleep" className={styles.label}>How many hours did you sleep last night?</label>
              <input type="number" id="sleep" name="sleep" min="0" max="24" className={styles.input} required />
              <button type="submit" className={styles.button}>Submit</button>
            </form>
          )}

          {submitted && (
            <div className={styles.resultBox}>
              <div className={styles.sleepRing}>
                <div className={styles.sleepValue}>{sleepHours}h</div>
              </div>
              <h2 className={styles.status} style={{ color: status.color }}>{status.label}</h2>
              <p className={styles.tip}><strong>Tip:</strong> {status.tip}</p>
              <button onClick={() => setSubmitted(false)} className={styles.recordAgain}>Record Another</button>
            </div>
          )}

          {/* ✅ OraTech Button */}
          <div className={styles.oratechSection}>
            <button onClick={handleUseOraTech} className={styles.button}>
              {loadingOraTech ? "Fetching OraTech Data..." : "🌙 Use OraTech Sleep Data"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SleepCycleSection;
