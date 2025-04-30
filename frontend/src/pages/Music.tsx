// src/pages/MusicDashboard.tsx

import React, { useState } from 'react';
import styles from '../styles/Music.module.css';
import MusicPlayer from './MusicPlayer';

const playlists = [
  {
    title: "Peaceful Rain",
    cover: "./images/peacefulrain.jpg",
    videoId: "V1RPi2MYptM", // working
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
    videoId: "s8EgcH9gCkQ", // ✅ Tibetan bells meditation
    mood: "Focus"
  },
  {
    title: "Morning Birds",
    cover: "./images/birds.jpg",
    videoId: "QCw0L6FupQ0", // ✅ Morning birds peaceful sounds
    mood: "Awaken"
  },
  {
    title: "Mountain Wind",
    cover: "./images/wind.jpg",
    videoId: "lD_FvL-Fb0M", // ✅ Wind sounds for relaxation
    mood: "Breeze"
  },
  {
    title: "Tibetan Bowl",
    cover: "/assets/tibetan.jpg",
    videoId: "WWcxeI3uZxI", // ✅ Tibetan singing bowls
    mood: "Meditate"
  },
  {
    title: "Deep Forest",
    cover: "./images/deepforest.jpg",
    videoId: "1ZYbU82GVz4", // ✅ Deep forest ambient sounds
    mood: "Nature"
  },
  {
    title: "Crackling Fire",
    cover: "/assets/fire.jpg",
    videoId: "eyU3bRy2x44", // ✅ Fireplace crackling sounds
    mood: "Warmth"
  },
  {
    title: "Night Crickets",
    cover: "/assets/crickets.jpg",
    videoId: "7oEEL8h9bms", // ✅ Night cricket sounds
    mood: "Sleep"
  },
  {
    title: "River Flow",
    cover: "/assets/river.jpg",
    videoId: "uItjZ_pj4eQ", // ✅ River flowing peacefully
    mood: "Flow"
  }
];


export default function MusicDashboard() {
  const [selectedTrack, setSelectedTrack] = useState(playlists[0]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
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

      {/* Main Content */}
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

      {/* Now Playing */}
      <aside className={styles.nowPlaying}>
        <MusicPlayer track={selectedTrack} />
      </aside>
    </div>
  );
}
