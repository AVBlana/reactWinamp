import React, { useContext, useEffect, useState } from "react";
import { FaFastForward, FaPause, FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { PlayingContext } from "../../context/Playing";
import { ServiceType } from "../../types/playerTypes";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import "./SpotifyPlayer.css";

interface SpotifyPlayerProps {
  token: string | null;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = () => {
  const { start, play, pause, seek, stop, playerState } = useSpotifyPlayer();

  const { currentSong } = useContext(PlayingContext);

  useEffect(() => {
    if (currentSong?.type === ServiceType.Spotify) {
      console.log(currentSong);
      start(`spotify:track:${currentSong.id}`).catch((error) => {
        console.error("Error starting track:", error);
      });
    }
  }, [currentSong?.id, currentSong?.type, start]);

  const handlePlay = () => {
    play().catch((error) => {
      console.error("Error playing track:", error);
    });
  };

  const handlePause = async () => {
    try {
      await pause();
    } catch (error) {
      console.error("Error pausing track:", error);
    }
  };

  const handleStop = () => {
    stop().catch((error) => {
      console.error("Error stopping track:", error);
    });
  };

  const handleSeek = (position: number) => {
    seek(position).catch((error) => {
      console.error("Error seeking track:", error);
    });
  };

  const vinylStyle = {
    backgroundImage: 'url("/vinylDisk.png")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };

  return (
    <div className="spotify-player">
      <div className="pickup-box">
        <div
          className={`vinyl ${playerState.isPlaying ? "spinning" : "static"}`}
        >
          <div className="vinyl-background" style={vinylStyle} />

          <>
            <img
              src={currentSong?.artwork.small.url}
              alt="Album Cover"
              className="album-cover"
            />
            <div className="black-hole" />
          </>
        </div>
        <div className="controls">
          <button onClick={handlePlay}>
            <FaPlay />
          </button>
          <button onClick={handlePause}>
            <FaPause />
          </button>
          <button onClick={handleStop}>
            <FaStop />
          </button>
          <button onClick={() => handleSeek(30000)}>
            <FaFastForward />
          </button>
        </div>
      </div>
      <div className="track-info">
        <p>
          {currentSong
            ? `${currentSong?.title} - ${currentSong?.artist.name}`
            : "No track playing"}
        </p>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
