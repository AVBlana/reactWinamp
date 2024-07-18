import React from "react";

interface Song {
  title: string;
  url: string;
}

interface YtPlaylistProps {
  songs: Song[];
  onSelect: (url: string) => void;
}

export const YtPlaylist: React.FC<YtPlaylistProps> = ({ songs, onSelect }) => (
  <div className="playlist">
    {songs.map((song, index) => (
      <div key={index} className="song" onClick={() => onSelect(song.url)}>
        {song.title}
      </div>
    ))}
  </div>
);
