// src/components/EmotionClassifierFaceAPI.tsx
import * as faceapi from '@vladmandic/face-api';
import React, { useEffect, useRef } from 'react';
import styles from "../styles/FaceMood.module.css";

interface Props {
  onMoodDetected: (mood: string) => void;
}

const EmotionClassifierFaceAPI = ({ onMoodDetected }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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
        const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
        const [topMood, confidence] = sorted[0];

        if (confidence > 0.5) {
          if (topMood === lastMood.current) {
            moodStableCount.current++;
            if (moodStableCount.current >= 2) {
              onMoodDetected(topMood); // ✅ only inform parent silently
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
        {/* ✅ No emoji, no mood shown. Just generic message */}
        <p className={styles.moodText}>Analyzing your expression...</p>
      </div>
    </div>
  );
};

export default EmotionClassifierFaceAPI;
