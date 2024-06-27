import React from "react";

interface Song {
  title: string;
  url: string;
}

interface PlaylistProps {
  songs: Song[];
  onSelect: (url: string) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ songs, onSelect }) => (
  <div className="playlist">
    {songs.map((song, index) => (
      <div key={index} className="song" onClick={() => onSelect(song.url)}>
        {song.title}
      </div>
    ))}
  </div>
);

export default Playlist;
