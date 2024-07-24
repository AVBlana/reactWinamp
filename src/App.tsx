import React, { useContext, useEffect, useState } from "react";
import MergedPlaylist from "./components/MergedPlaylist";
import SpotifyPlayer from "./components/players/SpotifyPlayer";
import YtPlayer from "./components/players/YtPlayer";
import Playlist from "./components/SpotifyPlaylist";
import SpotSearch from "./components/SpotifySearch";
import { TrackType } from "./components/SpotifyTrack";
import Tracklist from "./components/Tracklist";
import { YtPlaylist } from "./components/YtPlaylist";
import { Search } from "./components/YtSearch";
import { AppContext } from "./context/App";
import { PlayingContext, Song } from "./context/Playing";
import {
  fetchCurrentUser,
  saveTrack,
  createPlaylist,
} from "./services/SpotifyService";
import SpotifyAuth from "./components/SpotifyAuth";

type User = {
  id: string;
  display_name: string;
  images: { url: string }[];
};

const App: React.FC = () => {
  const {
    userGoogle,
    handleLogin,
    handleLogout: handleGoogleLogout,
  } = useContext(AppContext);

  const [tracklist, setTracklist] = useState<TrackType[]>([]);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [spotifyUser, setSpotifyUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [ytPlaylist, setYtPlaylist] = useState<Song[]>([]);
  const [ytPlaylistTitle, setYtPlaylistTitle] = useState("");
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(!!userGoogle);

  const { currentSong, handleSelectSong } = useContext(PlayingContext);
  const API_BASE_URL = "https://api.spotify.com/v1";

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
      setIsSpotifyLoggedIn(!!accessToken);
    };

    initializeSpotifyToken();
  }, []);

  const updateTracklist = (array: TrackType[]) => {
    setTracklist(array);
  };

  const addToPlaylist = (newTrack: TrackType) => {
    if (!playlist.some((t) => t.id === newTrack.id)) {
      setPlaylist((prev) => [...prev, newTrack]);
    }
  };

  const removeFromSpotifyPlaylist = (trackId: string) => {
    setPlaylist((prev) => prev.filter((n) => n.id !== trackId));
  };

  useEffect(() => {
    const fetchSpotifyUserData = async () => {
      if (spotifyToken) {
        try {
          const userData = await fetchCurrentUser(spotifyToken);
          setSpotifyUser(userData);
        } catch (error) {
          console.error("Error fetching Spotify user data:", error);
        }
      }
    };

    fetchSpotifyUserData();
  }, [spotifyToken]);

  const handleSaveTrack = async (trackId: string) => {
    try {
      await saveTrack(trackId, spotifyToken || "");
    } catch (error) {
      console.error("Error saving track:", error);
    }
  };

  const handleCreateSpotifyPlaylist = async () => {
    if (spotifyUser) {
      const userId = spotifyUser.id;
      try {
        const response = await createPlaylist(
          userId,
          playlistName,
          playlist.map((track) => track.uri),
          spotifyToken || ""
        );
        setPlaylist([]);
        setPlaylistName("");
        alert(`Your playlist ${playlistName} was successfully created!`);
      } catch (error) {
        console.error("Error creating playlist:", error);
      }
    }
  };

  useEffect(() => {
    const storedSongs = JSON.parse(localStorage.getItem("playlist") || "[]");
    setSongs(storedSongs);
  }, []);

  const handleRemoveFromYtPlaylist = (url: string) => {
    setYtPlaylist((prev) => prev.filter((song) => song.url !== url));
    localStorage.setItem(
      "ytPlaylist",
      JSON.stringify(ytPlaylist.filter((song) => song.url !== url))
    );
  };

  const removeFromMergedPlaylist = (
    trackId: string,
    source: "spotify" | "youtube"
  ) => {
    if (source === "spotify") {
      setPlaylist((prev) => prev.filter((track) => track.id !== trackId));
    } else if (source === "youtube") {
      setYtPlaylist((prev) => prev.filter((track) => track.url !== trackId));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">ReAMP</h1>
      <div className="flex">
        <div className="w-full">
          <div>
            <p className="font-bold text-lg">Spotify DB</p>
            <div>
              {spotifyUser ? (
                <>
                  {spotifyUser.images && spotifyUser.images.length > 0 && (
                    <button
                      className="p-2 bg-red-700"
                      onClick={() => {
                        localStorage.removeItem("token");
                        setSpotifyToken(null);
                        setSpotifyUser(null);
                        setIsSpotifyLoggedIn(false);
                      }}
                    >
                      <img
                        alt={spotifyUser.display_name}
                        src={spotifyUser.images[0].url}
                      />
                    </button>
                  )}
                  <button
                    className="p-2 bg-green-700 text-white"
                    onClick={() => {
                      localStorage.removeItem("token");
                      setSpotifyToken(null);
                      setSpotifyUser(null);
                      setIsSpotifyLoggedIn(false);
                    }}
                  >
                    <b>Logout {spotifyUser.display_name}</b>
                  </button>
                </>
              ) : (
                <SpotifyAuth />
              )}
            </div>
          </div>
          {spotifyToken && (
            <>
              <SpotSearch
                token={spotifyToken || ""}
                updateTracklist={updateTracklist}
              />
              <div className="flex">
                <Tracklist
                  data={tracklist}
                  addToPlaylist={addToPlaylist}
                  saveTrack={handleSaveTrack}
                />
                <Playlist
                  playlist={playlist}
                  removeFromPlaylist={removeFromSpotifyPlaylist}
                  setPlaylistName={setPlaylistName}
                  playlistName={playlistName}
                  createPlaylist={handleCreateSpotifyPlaylist}
                  token={spotifyToken || ""}
                  currentUser={fetchCurrentUser}
                />
              </div>
            </>
          )}
        </div>
        <div className="w-full mx-auto items-center justify-center">
          <p className="text-xl font-bold">YouTube DB</p>
          <Search ytPlaylist={ytPlaylist} setYtPlaylist={setYtPlaylist} />
          <YtPlayer />
          {!isGoogleLoggedIn ? (
            <button
              onClick={handleLogin}
              className="btn flex p-4 bg-blue-500 text-white font-semibold rounded-md"
            >
              Login with Google
            </button>
          ) : (
            <button
              onClick={handleGoogleLogout}
              className="btn bg-red-500 text-white p-2 mb-4"
            >
              Logout
            </button>
          )}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={ytPlaylistTitle}
              onChange={(e) => setYtPlaylistTitle(e.target.value)}
              placeholder="Enter playlist title"
              className="border-2 rounded-md p-2 w-full"
            />
            <YtPlaylist
              playlist={ytPlaylist}
              title={ytPlaylistTitle}
              onRemove={handleRemoveFromYtPlaylist}
            />
          </div>
        </div>
        <div>
          <MergedPlaylist
            spotifyPlaylist={playlist}
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
    </div>
  );
};

export default App;
