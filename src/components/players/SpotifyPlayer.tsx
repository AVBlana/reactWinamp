import React, { useEffect } from "react";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";

interface SpotifyPlayerProps {
  token: string;
  trackUri: string;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ token, trackUri }) => {
  const { start, play, pause, seek, stop } = useSpotifyPlayer(token);

  useEffect(() => {
    if (trackUri) {
      start(trackUri).then(() => console.log("Started track"));
    }
  }, [trackUri, start]);

  const handlePlay = () => {
    play().then(() => console.log("Playing track"));
  };

  const handlePause = () => {
    pause().then(() => console.log("Paused track"));
  };

  const handleStop = () => {
    stop().then(() => console.log("Stopped track"));
  };

  const handleSeek = (position: number) => {
    seek(position).then(() => console.log("Seeked to position", position));
  };

  return (
    <div>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={() => handleSeek(30000)}>Seek to 30s</button>
    </div>
  );
};

export default SpotifyPlayer;
