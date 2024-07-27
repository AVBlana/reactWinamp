import React, { useContext } from "react";
import ReactPlayer from "react-player";
import { PlayingContext } from "../../context/Playing";
import { ServiceType } from "../../types/playerTypes";

const YtPlayer = () => {
  const { currentSong, isPlaying } = useContext(PlayingContext);

  if (!currentSong) return null;

  return (
    <div className="player-wrapper">
      <ReactPlayer
        url={
          currentSong.type === ServiceType.Youtube
            ? `https://www.youtube.com/watch?v=${currentSong.id}`
            : ""
        }
        playing={isPlaying}
        controls
      />
    </div>
  );
};

export default YtPlayer;
