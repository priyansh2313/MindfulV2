import * as mobilenet from "@tensorflow-models/mobilenet";
import ColorThief from "colorthief";
import React, { useRef, useState } from "react";
import styles from "../styles/AuraTune.module.css";

import { exportMP3, generateMusicEnhanced, stopMusicEnhanced } from "./enhancedMusicEngine";
import { generateMoodDNA, MoodDNA } from "./generateMoodDNA";







export default function ImageAnalyser() {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [colors, setColors] = useState<number[][]>([]);
  const [mood, setMood] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Stop any existing music
  stopMusicEnhanced();
  setIsPlaying(false);

  const reader = new FileReader();
  reader.onloadend = () => {
    setImageURL(reader.result as string);
    setColors([]);
    setMood("");
    setLoading(false);
  };
  reader.readAsDataURL(file);

  // Reset input so user can upload the same file again if needed
  e.target.value = "";
};

  const analyzeImage = async () => {
    if (!imageRef.current) return;
    setLoading(true);

    try {
      const img = imageRef.current;
      await new Promise((res) => setTimeout(res, 100));

      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 5);
      setColors(palette);

      const model = await mobilenet.load();
      const predictions = await model.classify(img);
      const moodGuess = predictions[0]?.className || "Unknown";
      setMood(moodGuess);
    } catch (err) {
      console.error("Error analyzing image:", err);
    }

    setLoading(false);
  };

  const handleToggleMusic = async () => {
    if (!mood || colors.length === 0) return;

    const moodDNA: MoodDNA = generateMoodDNA(mood, colors);

    if (isPlaying) {
      await stopMusicEnhanced();
      setIsPlaying(false);
    } else {
      await generateMusicEnhanced(moodDNA, () => {});
      setIsPlaying(true);

      // Save to history
      const newEntry = {
        image: imageURL,
        mood,
        timestamp: new Date().toLocaleString(),
      };
      setHistory((prev) => [...prev, newEntry]);
    }
  };

  const handleDownload = async () => {
    const blob = await exportMP3();
    if (!blob) return;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aura_tune_${Date.now()}.mp3`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Transform <span>Your Images</span> Into <span>Beautiful Music</span>
      </h1>
      <p className={styles.subtitle}>
        Our AI analyzes your image to create a unique melody that captures its emotional essence.
      </p>

      <div className={styles.uploadSection}>
        <label className={styles.dropBox}>
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          <div className={styles.icon}>🎵</div>
          <p>Drop your image here<br />or click to browse</p>
        </label>
      </div>


      <div className={styles.stepSection}>
  <div className={styles.stepCard}>
    <span>📤</span>
    <p>Upload a meaningful image</p>
  </div>
  <div className={styles.stepCard}>
    <span>🧠</span>
    <p>We detect its mood & colors</p>
  </div>
  <div className={styles.stepCard}>
    <span>🎼</span>
    <p>And create a melody just for you</p>
  </div>
</div>



      {imageURL && (
        <div className={styles.resultContainer}>
          <img
            src={imageURL}
            alt="Uploaded"
            ref={imageRef}
            crossOrigin="anonymous"
            onLoad={analyzeImage}
            className={styles.image}
          />

          {loading ? (
            <p className={styles.loading}>🔍 Analyzing your image...</p>
          ) : (
            mood && colors.length > 0 && (
              <>
                <div className={styles.colorPalette}>
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className={styles.colorSwatch}
                      style={{ backgroundColor: `rgb(${color.join(",")})` }}
                    />
                  ))}
                </div>

                <h3 className={styles.mood}>🧠 Detected Mood: <span>{mood}</span></h3>

                <button onClick={handleToggleMusic} className={styles.musicButton}>
                  {isPlaying ? "⏹ Stop Music" : "▶️ Play Music"}
                </button>

                <button onClick={handleDownload} className={styles.downloadButton}>
                  🎧 Download as MP3
                </button>
              </>
            )
          )}
         

        </div>
      )}

      {history.length > 0 && (
        <div className={styles.historySection}>
          <h2>🎼 Your Past Creations</h2>
          <div className={styles.historyList}>
            {history.map((entry, idx) => (
              <div key={idx} className={styles.historyItem}>
                <img src={entry.image} className={styles.historyThumb} alt="Thumbnail" />
                <div className={styles.historyMeta}>
                  <p><strong>Mood:</strong> {entry.mood}</p>
                  <p><strong>Time:</strong> {entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      )}
      <div className={styles.encouragement}>
  <p>Made With 💗 by Team MINDFUL AI</p>
</div>
    </div>
    
  );
}
