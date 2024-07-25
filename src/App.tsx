import React, { useContext, useEffect } from "react";
import MergedPlaylist from "./components/MergedPlaylist";
import { AppContext } from "./context/App";
import { PlayingContext } from "./context/Playing";
import { fetchCurrentUser, createPlaylist } from "./services/SpotifyService";
import Spotify from "./components/Spotify";
import Youtube from "./components/Youtube";

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

  const removeFromMergedPlaylist = (
    trackId: string,
    source: "spotify" | "youtube"
  ) => {
    if (source === "spotify") {
      setSpotifyPlaylist((prev) =>
        prev.filter((track) => track.id !== trackId)
      );
    } else if (source === "youtube") {
      setYtPlaylist((prev) => prev.filter((track) => track.url !== trackId));
    }
  };

  useEffect(() => {
    const initializeSpotifyToken = () => {
      const hash = window.location.hash;
      let accessToken: string | null = localStorage.getItem("token");

      if (!accessToken && hash) {
        accessToken =
          hash
            .substring(1)
            .split("&")
            .find((elem) => elem.startsWith("access_token"))
            ?.split("=")[1] || null;

        window.location.hash = "";
        if (accessToken) {
          localStorage.setItem("token", accessToken);
        }
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
          <Spotify />
        </div>
        <div className="w-1/2 p-2">
          <Youtube />
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
