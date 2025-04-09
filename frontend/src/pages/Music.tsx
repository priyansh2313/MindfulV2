import { ArrowLeft, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import styles from "../styles/Music.module.css";

interface Track {
  title: string;
  artist: string;
  videoId: string;
  cover: string;
}

const tracks: Track[] = [
  {
    title: "Peaceful Rain",
    artist: "Nature Sounds",
    videoId: "V1RPi2MYptM", // YouTube Video ID
    cover: "/assets/rain.jpg",
  },
  {
    title: "Ocean Waves",
    artist: "Nature Sounds",
    videoId: "DLvfqAdwwFs",
    cover: "/assets/ocean.jpg",
  },
  {
    title: "Meditation Bell",
    artist: "Zen Music",
    videoId: "Q5dU6serXkg",
    cover: "/assets/meditation.jpg",
  },
];

const Music = () => {
  const navigate = useNavigate();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (direction: "next" | "prev") => {
    let newIndex = direction === "next" ? currentTrackIndex + 1 : currentTrackIndex - 1;
    if (newIndex < 0) newIndex = tracks.length - 1;
    if (newIndex >= tracks.length) newIndex = 0;
    setCurrentTrackIndex(newIndex);
    player?.loadVideoById(tracks[newIndex].videoId);
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${tracks[currentTrackIndex].cover})` }}>
      {/* Back Button */}
      <button onClick={() => navigate("/dashboard")} className={styles.backButton}>
        <ArrowLeft className="h-5 w-5 mr-2" /> Back
      </button>

      {/* Music Player UI */}
      <div className={styles.player}>
        <div className={styles.glow}></div>
        <img src={tracks[currentTrackIndex].cover} alt="Album Cover" className={styles.albumCover} />
        <h2 className={styles.trackTitle}>{tracks[currentTrackIndex].title}</h2>
        <p className={styles.trackArtist}>{tracks[currentTrackIndex].artist}</p>

        {/* Controls */}
        <div className={styles.controls}>
          <button onClick={() => handleSkip("prev")} className={styles.controlButton}>
            <SkipBack className="h-6 w-6" />
          </button>

          <button onClick={handlePlayPause} className={styles.controlButton}>
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </button>

          <button onClick={() => handleSkip("next")} className={styles.controlButton}>
            <SkipForward className="h-6 w-6" />
          </button>

          <button onClick={() => setIsMuted(!isMuted)} className={styles.controlButton}>
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </button>
        </div>

        {/* Hidden YouTube Player (Audio Only) */}
        <YouTube
          videoId={tracks[currentTrackIndex].videoId}
          opts={{
            height: "0",
            width: "0",
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              showinfo: 0,
              loop: 1,
              rel: 0,
            },
          }}
          onReady={(event) => {
            setPlayer(event.target);
            event.target.setVolume(isMuted ? 0 : 100);
          }}
        />
      </div>
    </div>
  );
};

export default Music;
