import React, { useContext, useEffect, useState } from "react";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import { Search } from "./components/Search";
import SpotSearch from "./components/SpotSearch";
import { TrackType } from "./components/Track";
import Tracklist from "./components/Tracklist";
import { AppContext } from "./context/App";
import { PlayingContext, Song } from "./context/Playing";
import {
  createPlaylist,
  fetchCurrentUser,
  saveTrack,
} from "./services/SpotifyService";
import { YtTracklist } from "./components/YtTracklist";
import { YtPlaylist } from "./components/YtPlaylist";
import MergedPlaylist from "./components/MergedPlaylist";
import axios from "axios";

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
  const [ytPlaylistTitle, setYtPlaylistTitle] = useState(""); // New state for YouTube playlist title
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(!!userGoogle);

  const { currentSong, handleSelectSong } = useContext(PlayingContext);

  const API_BASE_URL = "https://api.spotify.com/v1";

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

  const removeFromSpotifyPlaylist = (trackId: string) => {
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
      // Logic to remove a track from the Spotify playlist
      setPlaylist((prev) => prev.filter((track) => track.id !== trackId));
    } else if (source === "youtube") {
      // Logic to remove a track from the YouTube playlist
      setYtPlaylist((prev) => prev.filter((track) => track.url !== trackId));
    }
  };

  const handleCreateMergedPlaylist = async (
    userId: string,
    name: string,
    token: string
  ) => {
    try {
      // Combine Spotify and YouTube tracks URIs here if needed
      const spotifyTracksUris = playlist.map((track) => track.uri);
      const youtubeTracksUris = ytPlaylist.map((song) => song.url); // Assuming URL can be treated as a URI for this example
      const combinedUris = [...spotifyTracksUris, ...youtubeTracksUris];

      await createPlaylist(userId, name, combinedUris, token);
    } catch (error) {
      console.error("Error creating merged playlist:", error);
    }
  };

  const createPlaylist = async (
    userId: string,
    playlistName: string,
    tracksUris: string[],
    token: string
  ) => {
    try {
      const createResponse = await axios.post(
        `${API_BASE_URL}/users/${userId}/playlists`,
        {
          name: playlistName,
          description: "New playlist created by app",
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistId = createResponse.data.id;
      await axios.post(
        `${API_BASE_URL}/playlists/${playlistId}/tracks`,
        {
          uris: tracksUris,
          position: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return createResponse.data;
    } catch (error) {
      throw error;
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
                      onClick={handleSpotifyLogout}
                    >
                      <img
                        alt={spotifyUser.display_name}
                        src={spotifyUser.images[0].url}
                      />
                    </button>
                  )}
                  <button
                    className="p-2 bg-green-700 text-white"
                    onClick={handleSpotifyLogout}
                  >
                    <b>Logout {spotifyUser.display_name}</b>
                  </button>
                </>
              ) : null}
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
                removeFromPlaylist={removeFromSpotifyPlaylist}
                setPlaylistName={setPlaylistName}
                playlistName={playlistName}
                currentUser={fetchCurrentUser}
                createPlaylist={handleCreateSpotifyPlaylist}
                token={spotifyToken || ""}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-full mx-auto items-center justify-center">
          <p className="text-xl font-bold">YouTube DB</p>
          <Search ytPlaylist={ytPlaylist} setYtPlaylist={setYtPlaylist} />
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
            </>
          )}
          <div className="flex flex-col gap-2">
            {/* <YtTracklist songs={songs} onSelect={handleSelectSong} /> */}
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
            currentUser={fetchCurrentUser}
            createPlaylist={createPlaylist}
            token={spotifyToken || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
