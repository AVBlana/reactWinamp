import React, { useContext } from "react";
import ReactPlayer from "react-player";
import { PlayingContext } from "../context/Playing";

const Player = () => {
  const { currentSong, isPlaying } = useContext(PlayingContext);

  if (!currentSong) return null;

  // Handle different types of songs
  const getUrl = () => {
    if (currentSong.source === "spotify") {
      return `https://open.spotify.com/track/${currentSong.url}`;
    }
    return currentSong.url; // YouTube URL
  };

  return (
    <div className="player-wrapper">
      <ReactPlayer url={getUrl()} playing={isPlaying} controls />
    </div>
  );
};

export default Player;
