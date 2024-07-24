import React, { useState, useEffect, useContext } from "react";
import { Song } from "../context/Playing";
import { Search } from "./YtSearch";
import YtPlayer from "./players/YtPlayer";
import { YtPlaylist } from "./YtPlaylist";
import { AppContext } from "../context/App";

const Youtube: React.FC = () => {
  const {
    userGoogle,
    handleLogin,
    handleLogout: handleGoogleLogout,
  } = useContext(AppContext);

  const [ytPlaylist, setYtPlaylist] = useState<Song[]>([]);
  const [ytPlaylistTitle, setYtPlaylistTitle] = useState("");
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(!!userGoogle);

  useEffect(() => {
    const storedSongs = JSON.parse(localStorage.getItem("playlist") || "[]");
    setYtPlaylist(storedSongs);
  }, []);

  const handleRemoveFromYtPlaylist = (url: string) => {
    setYtPlaylist((prev) => prev.filter((song) => song.url !== url));
    localStorage.setItem(
      "ytPlaylist",
      JSON.stringify(ytPlaylist.filter((song) => song.url !== url))
    );
  };

  return (
    <div>
      {/* Your component JSX */}
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
  );
};

export default Youtube;
