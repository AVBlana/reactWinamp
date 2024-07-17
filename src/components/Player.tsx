import React, { useContext } from "react";
import ReactPlayer from "react-player";
import { PlayingContext } from "../context/Playing";

const Player = () => {
  const { currentSong, isPlaying } = useContext(PlayingContext);
  if (!currentSong) return null;
  return (
    <div className="player-wrapper">
      <ReactPlayer url={currentSong} playing={isPlaying} controls />
    </div>
  );
};

export default Player;
