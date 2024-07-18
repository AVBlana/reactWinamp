// src/context/Playing.tsx
import { createContext, ReactNode, useState } from "react";

export interface Song {
  title: string;
  url: string;
}

export const PlayingContext = createContext(
  {} as {
    currentSong: string | null;
    isPlaying: boolean;
    songs: Song[];
    handleSelectSong: (url: string) => void;
    changeSong: (url: string) => void;
  }
);

function usePlaying() {
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  const changeSong = (url: string) => {
    setCurrentSong(url);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleSelectSong = (url: string) => {
    setCurrentSong(url);
    setIsPlaying(true);
  };

  return { currentSong, isPlaying, handleSelectSong, songs, changeSong };
}

export const PlayingProvider = ({ children }: { children: ReactNode }) => {
  const values = usePlaying();
  return (
    <PlayingContext.Provider value={values}>{children}</PlayingContext.Provider>
  );
};
