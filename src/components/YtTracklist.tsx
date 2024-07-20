import React from "react";
import { Song } from "../context/Playing";

interface YtTracklistProps {
  songs: Song[];
  onSelect: (url: string) => void;
}

export const YtTracklist: React.FC<YtTracklistProps> = ({
  songs,
  onSelect,
}) => {
  return (
    <div>
      <h2>Your Youtube playlist</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.url} className="flex justify-between items-center">
            <div onClick={() => onSelect(song.url)} className="cursor-pointer">
              {song.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
