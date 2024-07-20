import React from "react";
import { Song } from "../context/Playing";

interface YtPlaylistProps {
  playlist: Song[];
  title: string;
  onRemove: (url: string) => void;
}

export const YtPlaylist: React.FC<YtPlaylistProps> = ({
  playlist,
  title,
  onRemove,
}) => {
  return (
    <div>
      <h2>{title || "Your YouTube Playlist"}</h2>
      <ul>
        {playlist.map((song) => (
          <li key={song.url} className="flex justify-between items-center">
            <div>{song.title}</div>
            <button
              onClick={() => onRemove(song.url)}
              className="ml-2 p-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
