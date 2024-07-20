import { useState } from "react";
import { Song } from "../../context/Playing";

function usePlaying() {
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState<Song[]>(() => {
    const storedSongs = localStorage.getItem("playlist");
    return storedSongs ? JSON.parse(storedSongs) : [];
  });

  const changeSong = (url: string) => {
    setCurrentSong(url);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleSelectSong = (url: string) => {
    setCurrentSong(url);
    setIsPlaying(true);
  };

  const addSong = (song: Song) => {
    setSongs((prevSongs) => {
      const updatedSongs = [...prevSongs, song];
      localStorage.setItem("playlist", JSON.stringify(updatedSongs));
      return updatedSongs;
    });
  };

  const removeSong = (url: string) => {
    setSongs((prevSongs) => {
      const updatedSongs = prevSongs.filter((song) => song.url !== url);
      localStorage.setItem("playlist", JSON.stringify(updatedSongs));
      return updatedSongs;
    });
  };

  return {
    currentSong,
    isPlaying,
    handleSelectSong,
    songs,
    changeSong,
    addSong,
    removeSong,
    setSongs,
  };
}

export default usePlaying;
