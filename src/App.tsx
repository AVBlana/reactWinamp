import React, { useContext, useEffect, useCallback } from "react";
import MergedPlaylist from "./components/MergedPlaylist";
import { AppContext } from "./context/App";
import { PlayingContext } from "./context/Playing";
import { fetchCurrentUser, createPlaylist } from "./services/SpotifyService";
import { ServiceType, Song } from "./types/playerTypes";
import { Search } from "./components/Search";

const App: React.FC = () => {
  const { spotifyToken, setSpotifyToken } = useContext(AppContext);
  const {
    spotifyPlaylist,
    setSpotifyPlaylist,
    ytPlaylist,
    setYtPlaylist,
    playlistName,
    setPlaylistName,
  } = useContext(PlayingContext);

  const removeFromMergedPlaylist = useCallback(
    (track: Song) => {
      if (track.type === ServiceType.Spotify) {
        setSpotifyPlaylist((prev) =>
          prev.filter((song) => song.id !== track.id)
        );
      } else if (track.type === ServiceType.Youtube) {
        setYtPlaylist((prev) => prev.filter((song) => song.id !== track.id));
      }
    },
    [setSpotifyPlaylist, setYtPlaylist]
  );

  useEffect(() => {
    const initializeSpotifyToken = () => {
      const hash = window.location.hash;
      const storedToken = localStorage.getItem("token");
      let accessToken = storedToken;

      if (!accessToken && hash) {
        const tokenParam = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("access_token"));
        accessToken = tokenParam?.split("=")[1] || null;

        if (accessToken) {
          localStorage.setItem("token", accessToken);
        }
        window.location.hash = ""; // Clear hash to prevent reloading with token
      }

      setSpotifyToken(accessToken);
    };

    initializeSpotifyToken();
  }, [setSpotifyToken]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">ReAMP</h1>
      <div className="flex">
        <div className="w-1/2 p-2">
          <Search />
        </div>
      </div>
      <div>
        <MergedPlaylist
          spotifyPlaylist={spotifyPlaylist}
          youtubePlaylist={ytPlaylist}
          removeFromPlaylist={removeFromMergedPlaylist}
          setPlaylistName={setPlaylistName}
          playlistName={playlistName}
          createPlaylist={createPlaylist}
          token={spotifyToken || ""}
          currentUser={fetchCurrentUser}
        />
      </div>
    </div>
  );
};

export default App;
