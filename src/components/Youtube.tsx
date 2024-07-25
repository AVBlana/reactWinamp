import React, { useContext, useEffect, useState } from "react";
import { Search } from "./YtSearch";
import YtPlayer from "./players/YtPlayer";
import { YtPlaylist } from "./YtPlaylist";
import { AppContext } from "../context/App";
import { PlayingContext } from "../context/Playing";

const Youtube: React.FC = () => {
  const {
    userGoogle,
    handleLogin,
    handleLogout: handleGoogleLogout,
  } = useContext(AppContext);
  const { ytPlaylist, setYtPlaylist } = useContext(PlayingContext);
  const [ytPlaylistTitle, setYtPlaylistTitle] = useState("");

  useEffect(() => {
    const storedSongs = JSON.parse(localStorage.getItem("ytPlaylist") || "[]");
    setYtPlaylist(storedSongs);
  }, [setYtPlaylist]);

  const handleRemoveFromYtPlaylist = (url: string) => {
    setYtPlaylist((prev) => prev.filter((song) => song.url !== url));
    localStorage.setItem(
      "ytPlaylist",
      JSON.stringify(ytPlaylist.filter((song) => song.url !== url))
    );
  };

  return (
    <div>
      <Search ytPlaylist={ytPlaylist} setYtPlaylist={setYtPlaylist} />
      <YtPlayer />
      {!userGoogle ? (
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
