import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import ColorThief from "color-thief-browser";
import React, { useRef, useState } from "react";
import styles from "../styles/AuraTune.module.css";
import { generateMusic, stopMusic } from "./useMusic";

export default function ImageToEmotion() {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [colors, setColors] = useState<number[][]>([]);
  const [mood, setMood] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageURL(reader.result as string);
      setColors([]);
      setMood("");
      setIsPlaying(false);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageRef.current) return;
    setLoading(true);
  
    try {
      // Ensure image is fully loaded before processing
      const img = imageRef.current;
  
      // Wait a little to ensure image is rendered
      await new Promise((resolve) => setTimeout(resolve, 100));
  
      const colorThief = new ColorThief();
  
      // Check if the image is loaded and complete
      if (img.complete) {
        const palette = colorThief.getPalette(img, 5);
        setColors(palette);
      } else {
        console.warn("Image not fully loaded");
      }
  
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

    if (isPlaying) {
      stopMusic();
      setIsPlaying(false);
    } else {
      await generateMusic(mood, colors);
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎵 MoodScape — Image to Emotion Music</h1>
      <p className={styles.subtitle}>Upload an image and let it craft music from your emotions.</p>

      <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.upload} />

      {imageURL && (
        <>
          <img
          

            src={imageURL}
            alt="Uploaded"
            ref={imageRef}
            crossOrigin="anonymous"
            className={styles.image}
            onLoad={analyzeImage}
          />

          {loading && <p className={styles.loading}>Analyzing mood and generating music...</p>}

          {!loading && mood && colors.length > 0 && (
            <>
              <div className={styles.colors}>
  {colors.map((color, index) => (
    <div
      key={index}
      className={styles.colorSwatch}
      style={{ backgroundColor: `rgb(${color.join(",")})` }}
    />
  ))}
</div>


              <h3 className={styles.mood}>🧠 Detected Mood: <span>{mood}</span></h3>

              <button onClick={handleToggleMusic} className={styles.musicButton}>
                {isPlaying ? "⏹ Stop Music" : "▶️ Play Music"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
