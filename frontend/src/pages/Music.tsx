// src/pages/MusicDashboard.tsx

import React, { useEffect, useState } from 'react';
import styles from '../styles/Music.module.css';
import { logFeedback, updateExplorationRate } from "../utils/reinforcement";
import MusicPlayer from './MusicPlayer';

const playlists = [
  {
    title: "Peaceful Rain",
    cover: "./images/peacefulrain.jpg",
    videoId: "V1RPi2MYptM",
    mood: "Relax"
  },
  {
    title: "Ocean Waves",
    cover: "./images/seawaves.jpg",
    videoId: "v=N2p-5LPnsJMn",
    mood: "Calm"
  },
  {
    title: "Zen Bell",
    cover: "./images/zenbowl.jpg",
    videoId: "s8EgcH9gCkQ",
    mood: "Focus"
  },
  {
    title: "Morning Birds",
    cover: "./images/birds.jpg",
    videoId: "QCw0L6FupQ0",
    mood: "Awaken"
  },
  {
    title: "Mountain Wind",
    cover: "./images/wind.jpg",
    videoId: "lD_FvL-Fb0M",
    mood: "Breeze"
  },
  {
    title: "Tibetan Bowl",
    cover: "/assets/tibetan.jpg",
    videoId: "WWcxeI3uZxI",
    mood: "Meditate"
  },
  {
    title: "Deep Forest",
    cover: "./images/deepforest.jpg",
    videoId: "1ZYbU82GVz4",
    mood: "Nature"
  },
  {
    title: "Crackling Fire",
    cover: "/assets/fire.jpg",
    videoId: "eyU3bRy2x44",
    mood: "Warmth"
  },
  {
    title: "Night Crickets",
    cover: "/assets/crickets.jpg",
    videoId: "7oEEL8h9bms",
    mood: "Sleep"
  },
  {
    title: "River Flow",
    cover: "/assets/river.jpg",
    videoId: "uItjZ_pj4eQ",
    mood: "Flow"
  }
];

export default function MusicDashboard() {
  const [selectedTrack, setSelectedTrack] = useState(playlists[0]);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    setFeedbackGiven(false);
  }, [selectedTrack]);

  useEffect(() => {
    if (!localStorage.getItem("todayMood")) {
      localStorage.setItem("todayMood", "anxious");
    }
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <h2>🎧 Calm Library</h2>
        <ul>
          {playlists.map((item, index) => (
            <li
              key={index}
              className={`${styles.playlistItem} ${item.title === selectedTrack.title ? styles.active : ''}`}
              onClick={() => setSelectedTrack(item)}
            >
              <img src={item.cover} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.mood}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Made for You</h1>
          <p>Select a soundscape and let your mind relax</p>
        </div>
        <div className={styles.feedGrid}>
          {playlists.map((item, index) => (
            <div
              key={index}
              className={styles.feedCard}
              onClick={() => setSelectedTrack(item)}
            >
              <img src={item.cover} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.mood}</p>
            </div>
          ))}
        </div>
      </main>

      <aside className={styles.nowPlaying}>
        <MusicPlayer track={selectedTrack} />
      </aside>

      <div className="mt-4 text-center text-white">
        {!feedbackGiven ? (
          <>
            <p>🎧 Was this music helpful for your mood?</p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
                onClick={() => {
                  const mood = (localStorage.getItem("todayMood") || "unknown") as Mood;
                  console.log("Logging feedback: YES", { mood, action: "music" });
                  logFeedback(mood, "music", 1);
                  updateExplorationRate();
                  setFeedbackGiven(true);
                }}
              >
                Yes
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                onClick={() => {
                  const mood = (localStorage.getItem("todayMood") || "unknown") as Mood;
                  console.log("Logging feedback: NO", { mood, action: "music" });
                  logFeedback(mood, "music", 0);
                  updateExplorationRate();
                  setFeedbackGiven(true);
                }}
              >
                No
              </button>
            </div>
          </>
        ) : (
          <p className="mt-4 text-green-300">Thanks for your feedback! 😊</p>
        )}
      </div>
    </div>
  );
}
