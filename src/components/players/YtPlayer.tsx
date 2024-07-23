import React, { useContext } from "react";
import ReactPlayer from "react-player";
import { PlayingContext } from "../../context/Playing";

const YtPlayer = () => {
  const { currentSong, isPlaying } = useContext(PlayingContext);

  if (!currentSong) return null;

  // Handle only YouTube songs
  const getUrl = () => {
    if (currentSong.source !== "youtube") {
      return null;
    }
    return currentSong.url;
  };

  const url = getUrl();

  if (!url) {
    return (
      <div className="player-wrapper">
        <p>Only YouTube URLs are supported</p>
      </div>
    );
  }

  return (
    <div className="player-wrapper">
      <ReactPlayer url={url} playing={isPlaying} controls />
    </div>
  );
};

export default YtPlayer;
