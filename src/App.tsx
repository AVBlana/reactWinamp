import React, { useContext, useEffect, useState } from "react";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import { Search } from "./components/Search";
import SpotSearch from "./components/SpotSearch";
import { TrackType } from "./components/Track";
import Tracklist from "./components/Tracklist";
import { YtPlaylist } from "./components/YtPlaylist";
import { AppContext } from "./context/App";
import { PlayingContext, Song } from "./context/Playing";
import {
  createPlaylist,
  fetchCurrentUser,
  saveTrack,
} from "./services/SpotifyService";

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
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(!!userGoogle);

  const { currentSong, handleSelectSong } = useContext(PlayingContext);

  const handleSpotifyLogout = () => {
    localStorage.removeItem("token");
    setSpotifyToken(null);
    setSpotifyUser(null);
    setIsSpotifyLoggedIn(false);
  };

  useEffect(() => {
    const initializeSpotifyToken = () => {
      const hash = window.location.hash;
      let accessToken: string | null = window.localStorage.getItem("token");

      if (!accessToken && hash) {
        accessToken =
          hash
            .substring(1)
            .split("&")
            .find((elem) => elem.startsWith("access_token"))
            ?.split("=")[1] || null;

        window.location.hash = "";
        if (accessToken) {
          window.localStorage.setItem("token", accessToken);
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

  const removeFromPlaylist = (trackId: string) => {
    setPlaylist((prev) => prev.filter((n) => n.id !== trackId));
  };

  useEffect(() => {
    const fetchSpotifyUserData = async () => {
      try {
        if (spotifyToken) {
          const userData = await fetchCurrentUser(spotifyToken);
          setSpotifyUser(userData);
        }
      } catch (error) {
        console.error("Error fetching Spotify user data:", error);
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

  const handleCreatePlaylist = async () => {
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">ReAMP</h1>
      <div className="flex">
        <div className="w-full">
          <div>
            <p className="font-bold text-lg">Spotify DB</p>
            <div>
              {spotifyUser &&
                spotifyUser.images &&
                spotifyUser.images.length > 0 && (
                  <button onClick={handleSpotifyLogout}>
                    <img
                      alt={spotifyUser.display_name}
                      src={spotifyUser.images[0].url}
                    />
                  </button>
                )}
              <button onClick={handleSpotifyLogout}>
                <b>{spotifyUser ? spotifyUser.display_name : ""}</b>
              </button>
            </div>
          </div>
          <SpotSearch token={spotifyToken} updateTracklist={updateTracklist} />
          {spotifyToken ? (
            <div className="flex">
              <Tracklist
                data={tracklist}
                addToPlaylist={addToPlaylist}
                saveTrack={handleSaveTrack}
              />
              <Playlist
                playlist={playlist}
                removeFromPlaylist={removeFromPlaylist}
                setPlaylistName={setPlaylistName}
                playlistName={playlistName}
                currentUser={fetchCurrentUser}
                createPlaylist={handleCreatePlaylist}
                token={spotifyToken || ""}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-full mx-auto items-center justify-center">
          <p className="text-xl font-bold">YouTube DB</p>
          <Search />
          <Player />

          {!isGoogleLoggedIn ? (
            <button
              onClick={handleLogin}
              className="btn flex p-4 bg-blue-500 text-white font-semibold rounded-md"
            >
              Login with Google
            </button>
          ) : (
            <>
              <button
                onClick={handleGoogleLogout}
                className="btn bg-red-500 text-white p-2 mb-4"
              >
                Logout
              </button>

              <YtPlaylist songs={songs} onSelect={handleSelectSong} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
