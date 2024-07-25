import { createContext, ReactNode, useState } from "react";
import { TrackType } from "../components/SpotifyTrack";

export interface Song {
  title?: string;
  url: string;
  source?: string;
}

export const PlayingContext = createContext(
  {} as {
    currentSong: Song | null;
    isPlaying: boolean;
    songs: Song[];
    handleSelectSong: (song: Song) => void;
    changeSong: (song: Song) => void;
    addSong: (song: Song) => void;
    removeSong: (url: string) => void;
    setSongs: (song: Song[]) => void;
    spotifyPlaylist: TrackType[];
    setSpotifyPlaylist: React.Dispatch<React.SetStateAction<TrackType[]>>;
    ytPlaylist: Song[];
    setYtPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
    playlistName: string;
    setPlaylistName: React.Dispatch<React.SetStateAction<string>>;
  }
);

function usePlaying() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState<Song[]>(() => {
    const storedSongs = localStorage.getItem("playlist");
    return storedSongs ? JSON.parse(storedSongs) : [];
  });
  const [spotifyPlaylist, setSpotifyPlaylist] = useState<TrackType[]>([]);
  const [ytPlaylist, setYtPlaylist] = useState<Song[]>([]);
  const [playlistName, setPlaylistName] = useState("");

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
    spotifyPlaylist,
    setSpotifyPlaylist,
    ytPlaylist,
    setYtPlaylist,
    playlistName,
    setPlaylistName,
  };
}

export const PlayingProvider = ({ children }: { children: ReactNode }) => {
  const values = usePlaying();
  return (
    <PlayingContext.Provider value={values}>{children}</PlayingContext.Provider>
  );
};
