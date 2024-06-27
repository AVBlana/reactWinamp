import React, { useState } from "react";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import AddSongForm from "./components/AddSongForm";

interface Song {
  title: string;
  url: string;
}

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddSong = (song: Song) => {
    setSongs([...songs, song]);
  };

  const handleSelectSong = (url: string) => {
    setCurrentSong(url);
    setIsPlaying(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Winamp Clone</h1>
      <AddSongForm onAdd={handleAddSong} />
      <Playlist songs={songs} onSelect={handleSelectSong} />
      {currentSong && <Player url={currentSong} playing={isPlaying} />}
    </div>
  );
};

export default App;
