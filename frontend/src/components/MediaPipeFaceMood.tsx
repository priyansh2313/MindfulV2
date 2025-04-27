import * as cam from "@mediapipe/camera_utils";
import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/FaceMood.module.css";

interface Props {
  onMoodDetected: (mood: string) => void;
}

const moodEmojis: { [key: string]: string } = {
  happy: "😊",
  sad: "😢",
  anxious: "😟",
  angry: "😠",
  surprised: "😮",
  neutral: "😐",
};

const MediaPipeFaceMood = ({ onMoodDetected }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mood, setMood] = useState("neutral");
  const stableCount = useRef(0);
  const lastMood = useRef("neutral");

  useEffect(() => {
    const videoEl = videoRef.current!;
    let camera: cam.Camera | null = null;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks.length) return;
      const lm = results.multiFaceLandmarks[0];

      const leftBrow = lm[65].y;
      const rightBrow = lm[295].y;
      const browHeight = (leftBrow + rightBrow) / 2;

      const upperLip = lm[13].y;
      const lowerLip = lm[14].y;
      const mouthGap = lowerLip - upperLip;

      const leftEyeOpen = lm[159].y - lm[145].y;
      const rightEyeOpen = lm[386].y - lm[374].y;
      const eyeOpen = (leftEyeOpen + rightEyeOpen) / 2;

      const leftLip = lm[61].y;
      const rightLip = lm[291].y;
      const mouthTilt = Math.abs(leftLip - rightLip);

      let detectedMood = "neutral";

      if (mouthGap > 0.06 && browHeight > 0.25) {
        detectedMood = "happy"; // laughing
      } else if (mouthGap > 0.04 && mouthTilt < 0.015) {
        detectedMood = "happy"; // smiling gently
      } else if (eyeOpen > 0.06 && browHeight > 0.3) {
        detectedMood = "surprised";
      } else if (browHeight < 0.2 && eyeOpen < 0.03) {
        detectedMood = "angry";
      } else if (mouthTilt > 0.02 && browHeight > 0.28) {
        detectedMood = "anxious";
      } else if (mouthGap < 0.02 && browHeight > 0.3 && eyeOpen < 0.025) {
        detectedMood = "sad";
      }

      setMood(detectedMood);

      if (detectedMood === lastMood.current) {
        stableCount.current++;
        if (stableCount.current >= 3) {
          onMoodDetected(detectedMood);
        }
      } else {
        lastMood.current = detectedMood;
        stableCount.current = 1;
      }
    });

    if (videoEl) {
      camera = new cam.Camera(videoEl, {
        onFrame: async () => {
          await faceMesh.send({ image: videoEl });
        },
        width: 360,
        height: 280,
      });
      camera.start();
    }

    return () => {
      camera?.stop();
    };
  }, [onMoodDetected]);

  return (
    <div className={styles.wrapper}>
      <video ref={videoRef} autoPlay muted playsInline className={styles.video} />
      <div className={styles.moodFloatingBox}>
        <span className={styles.emoji}>{moodEmojis[mood]}</span>
        <p className={styles.moodText}>You're looking {mood}!</p>
      </div>
    </div>
  );
};

export default MediaPipeFaceMood;
