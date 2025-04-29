// src/components/EmotionClassifierFaceAPI.tsx
import * as faceapi from '@vladmandic/face-api';
import React, { useEffect, useRef, useState } from 'react';
import styles from "../styles/FaceMood.module.css";

interface Props {
  onMoodDetected: (mood: string) => void;
}

const emotionEmojis: { [key: string]: string } = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fearful: "😨",
  disgusted: "🤢",
  surprised: "😮",
  neutral: "😐",
};

const EmotionClassifierFaceAPI = ({ onMoodDetected }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentMood, setCurrentMood] = useState("neutral");
  const lastMood = useRef("neutral");
  const moodStableCount = useRef(0);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.load(`${MODEL_URL}/`);
      await faceapi.nets.faceExpressionNet.load(`${MODEL_URL}/`);
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    const detectMood = async () => {
      if (!videoRef.current) return;
    
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
    
      if (!detections) {
        console.log("😐 No face detected");
        return;
      }
    
      if (detections.expressions) {
        console.log("📊 Expressions:", detections.expressions);
    
        const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
        const [topMood, confidence] = sorted[0];
    
        console.log(`🎯 Top Mood: ${topMood} (${confidence.toFixed(2)})`);
    
        if (confidence > 0.5) {
          setCurrentMood(topMood);
    
          if (topMood === lastMood.current) {
            moodStableCount.current++;
            if (moodStableCount.current >= 2) {
              onMoodDetected(topMood);
            }
          } else {
            lastMood.current = topMood;
            moodStableCount.current = 1;
          }
        }
      }
    };
    
    loadModels().then(() => {
      startVideo();
      const interval = setInterval(detectMood, 1000);
      return () => clearInterval(interval);
    });
  }, [onMoodDetected]);

  return (
    <div className={styles.wrapper}>
      <video ref={videoRef} autoPlay muted playsInline className={styles.video} />
      <div className={styles.moodFloatingBox}>
        <span className={styles.emoji}>{emotionEmojis[currentMood]}</span>
        <p className={styles.moodText}>Detected mood: {currentMood}</p>
      </div>
    </div>
  );
};

export default EmotionClassifierFaceAPI;
