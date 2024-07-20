import { createContext, ReactNode, useState } from "react";

export interface Song {
  title?: string;
  url: string;
  source?: string;
}

export const PlayingContext = createContext(
  {} as {
    currentSong: Song | null; // Change to Song type
    isPlaying: boolean;
    songs: Song[];
    handleSelectSong: (song: Song) => void; // Updated to handle Song type
    changeSong: (song: Song) => void; // Updated to handle Song type
    addSong: (song: Song) => void;
    removeSong: (url: string) => void;
    setSongs: (song: Song[]) => void;
  }
);

function usePlaying() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null); // Changed type
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState<Song[]>(() => {
    const storedSongs = localStorage.getItem("playlist");
    return storedSongs ? JSON.parse(storedSongs) : [];
  });

  const changeSong = (song: Song) => {
    setCurrentSong(song);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleSelectSong = (song: Song) => {
    setCurrentSong(song);
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

export const PlayingProvider = ({ children }: { children: ReactNode }) => {
  const values = usePlaying();
  return (
    <PlayingContext.Provider value={values}>{children}</PlayingContext.Provider>
  );
};
