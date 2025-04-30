// src/components/MusicPlayer.tsx

import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import styles from '../styles/MusicPlayer.module.css';

interface Props {
  track: {
    title: string;
    videoId: string;
    cover: string;
    mood: string;
  };
}

const MusicPlayer = ({ track }: Props) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    if (player) {
      try {
        player.loadVideoById(track.videoId);
        player.playVideo();
        player.setVolume(isMuted ? 0 : 100);
        setIsPlaying(true);
      } catch (err) {
        console.warn('YouTube load issue:', err);
      }
    }
  }, [track, player]);

  const handlePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    if (!player) return;
    player.setVolume(isMuted ? 100 : 0);
    setIsMuted(!isMuted);
  };

  return (
    <div className={styles.playerWrapper}>
      <h3>🎶 Now Playing</h3>
      <img src={track.cover} className={styles.coverImage} alt="Now Playing Cover" />
      <h2 className={styles.title}>{track.title}</h2>
      <p className={styles.mood}>Mood: {track.mood}</p>

      <div className={styles.controls}>
        <button onClick={handlePlayPause} className={styles.controlBtn}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button onClick={handleMute} className={styles.controlBtn}>
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>

      <YouTube
        videoId={track.videoId}
        className={styles.hiddenPlayer}
        opts={{
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            showinfo: 0,
          },
        }}
        onReady={(e) => {
          setPlayer(e.target);
          setTimeout(() => {
            try {
              e.target.setVolume(isMuted ? 0 : 100);
              e.target.playVideo();
            } catch (err) {
              console.warn('Player setup failed:', err);
            }
          }, 200);
        }}
      />
    </div>
  );
};

export default MusicPlayer;
