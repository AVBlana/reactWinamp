import React, {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Song } from "../types/playerTypes";

interface PlayingContextProps {
  currentSong: Song | null;
  isPlaying: boolean;
  songs: Song[];
  handleSelectSong: (song: Song) => void;
  changeSong: (song: Song) => void;
  addSong: (song: Song) => void;
  removeSong: (url: string) => void;
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  spotifyPlaylist: Song[];
  setSpotifyPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
  ytPlaylist: Song[];
  setYtPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
  playlistName: string;
  setPlaylistName: React.Dispatch<React.SetStateAction<string>>;
}

export const PlayingContext = createContext<PlayingContextProps>({
  currentSong: null,
  isPlaying: false,
  songs: [],
  handleSelectSong: () => {},
  changeSong: () => {},
  addSong: () => {},
  removeSong: () => {},
  setSongs: () => {},
  spotifyPlaylist: [],
  setSpotifyPlaylist: () => {},
  ytPlaylist: [],
  setYtPlaylist: () => {},
  playlistName: "",
  setPlaylistName: () => {},
});

function usePlaying() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState<Song[]>(() => {
    const storedSongs = localStorage.getItem("playlist");
    return storedSongs ? JSON.parse(storedSongs) : [];
  });
  const [spotifyPlaylist, setSpotifyPlaylist] = useState<Song[]>([]);
  const [ytPlaylist, setYtPlaylist] = useState<Song[]>([]);
  const [playlistName, setPlaylistName] = useState("");

  // Memoize context values to prevent unnecessary re-renders
  const handleSelectSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const changeSong = useCallback(
    (song: Song) => {
      setCurrentSong(song);
      if (!isPlaying) setIsPlaying(true);
    },
    [isPlaying]
  );

  const addSong = useCallback((song: Song) => {
    setSongs((prevSongs) => {
      const updatedSongs = [...prevSongs, song];
      localStorage.setItem("playlist", JSON.stringify(updatedSongs));
      return updatedSongs;
    });
  }, []);

  const removeSong = useCallback((id: string) => {
    setSongs((prevSongs) => {
      const updatedSongs = prevSongs.filter((song) => song.id !== id);
      localStorage.setItem("playlist", JSON.stringify(updatedSongs));
      return updatedSongs;
    });
  }, []);

  // Memoized context values
  const contextValue = useMemo(
    () => ({
      songs,
      currentSong,
      isPlaying,
      handleSelectSong,
      changeSong,
      addSong,
      removeSong,
      setSongs,
      spotifyPlaylist,
      setSpotifyPlaylist,
      ytPlaylist,
      setYtPlaylist,
      playlistName,
      setPlaylistName,
    }),
    [
      currentSong,
      isPlaying,
      spotifyPlaylist,
      ytPlaylist,
      playlistName,
      handleSelectSong,
      changeSong,
      addSong,
      removeSong,
      setSongs,
      songs,
    ]
  );

  return contextValue;
}

export const PlayingProvider = ({ children }: { children: ReactNode }) => {
  const values = usePlaying();
  return (
    <PlayingContext.Provider value={values}>{children}</PlayingContext.Provider>
  );
};
