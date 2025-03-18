import { ArrowLeft, Music as MusicIcon, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useNavigate } from "react-router-dom";

interface Track {
  title: string;
  artist: string;
  duration: string;
  url: string;
  category: string;
  cover: string;
}

const tracks: Track[] = [
  {
    title: "Peaceful Rain",
    artist: "Nature Sounds",
    duration: "5:30",
    url: "https://youtu.be/V1RPi2MYptM?si=ewVzBg0fs7cSMBe1",
    category: "Nature",
    cover: "419611.jpg"
  },
  {
    title: "Ocean Waves",
    artist: "Nature Sounds",
    duration: "6:15",
    url: "https://cdn.pixabay.com/download/audio/2021/10/25/audio_d1a76f2f60.mp3",
    category: "Nature",
    cover: "unnamed.jpg"
  },
  {
    title: "Meditation Bell",
    artist: "Zen Music",
    duration: "4:45",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    category: "Meditation",
    cover: "wallpaperflare.com_wallpaper.jpg"
  }
];

const Music = () => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<AudioPlayer>(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.audio.current?.pause();
    } else {
      playerRef.current?.audio.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackChange = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold flex items-center">
              <MusicIcon className="h-6 w-6 mr-2" />
              Relaxing Music
            </h1>
          </div>

          {/* Song List */}
          <div className="p-6">
            <div className="grid gap-4">
              {tracks.map((track) => (
                <div
                  key={track.title}
                  className={`p-4 rounded-lg flex items-center space-x-4 transition cursor-pointer ${
                    currentTrack?.title === track.title
                      ? "bg-indigo-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => handleTrackChange(track)}
                >
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{track.title}</h3>
                    <p className="text-sm text-gray-300">{track.artist}</p>
                  </div>
                  <span className="text-sm text-gray-300">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Player Controls */}
          {currentTrack && (
            <div className="bg-gray-900 p-6 flex flex-col items-center border-t border-gray-700">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-28 h-28 rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
              <p className="text-sm text-gray-400">{currentTrack.artist}</p>

              {/* Audio Player */}
              <AudioPlayer
                ref={playerRef}
                src={currentTrack.url}
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                showJumpControls={false}
                customProgressBarSection={["PROGRESS_BAR"]}
                customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                customIcons={{
                  play: <Play className="h-6 w-6 text-white" />,
                  pause: <Pause className="h-6 w-6 text-white" />,
                }}
                className="w-full"
              />

              {/* Extra Controls */}
              <div className="flex items-center justify-between w-full mt-4">
                <button
                  onClick={handlePlayPause}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                >
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Music;
