import React from "react";
import ReactPlayer from "react-player";

interface PlayerProps {
  url: string;
  playing: boolean;
}

const Player: React.FC<PlayerProps> = ({ url, playing }) => (
  <div className="player-wrapper">
    <ReactPlayer url={url} playing={playing} controls />
  </div>
);

export default Player;
