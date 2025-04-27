import * as faceapi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";
import styles from "./../styles/FaceMood.module.css";

interface Props {
  onMoodDetected: (mood: string) => void;
}

const moodEmojis: { [key: string]: string } = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😮",
  disgusted: "🤢",
  fearful: "😨",
  neutral: "😐",
};

const moodMessages: { [key: string]: string } = {
  happy: "You're looking happy!",
  sad: "Feeling down?",
  angry: "Frustrated lately?",
  surprised: "Something unexpected?",
  disgusted: "Feeling uneasy?",
  fearful: "A little anxious?",
  neutral: "Show us how you feel 😊",
};

const FaceMood = ({ onMoodDetected }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastMood = useRef("neutral");
  const moodStableCount = useRef(0);
  const [currentMood, setCurrentMood] = useState("neutral");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            startDetectionLoop();
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    const startDetectionLoop = () => {
      const interval = setInterval(detectMood, 600);
      return () => clearInterval(interval);
    };

    const detectMood = async () => {
        const video = videoRef.current;
        if (!video || video.readyState !== 4 || video.paused || video.ended) return;
      
        try {
          const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
      
          if (!detection?.expressions) {
            setCurrentMood("neutral");
            return;
          }
      
          const sorted = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1]);
          const [topMood, confidence] = sorted[0];
      
          if (confidence > 0.5) {
            setCurrentMood(topMood);
            if (topMood === lastMood.current) {
              moodStableCount.current++;
              if (moodStableCount.current >= 3) onMoodDetected(topMood);
            } else {
              lastMood.current = topMood;
              moodStableCount.current = 1;
            }
          }
        } catch (err) {
          console.warn("❌ Mood detection error:", err);
          setCurrentMood("neutral");
        }
      };
      
    loadModels().then(startVideo);
  }, [onMoodDetected]);

  return (
    <div className={styles.wrapper}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width="320"
        height="240"
        className={styles.video}
      />
      <div className={styles.moodOverlay}>
        <span className={styles.emoji}>{moodEmojis[currentMood]}</span>
        <p className={styles.moodText}>{moodMessages[currentMood]}</p>
      </div>
    </div>
  );
};

export default FaceMood;
