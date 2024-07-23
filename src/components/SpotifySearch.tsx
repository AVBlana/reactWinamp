import React, { FormEventHandler, useState } from "react";
import { TrackType } from "./SpotifyTrack";
import SpotifyAuth from "./SpotifyAuth";

const SpotSearch = ({
  token,
  updateTracklist,
}: {
  token: string | null;
  updateTracklist: (tracks: TrackType[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("token");
        window.location.reload();
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const tracks = data.tracks.items.map((track: TrackType) => ({
        ...track,
        url: `https://open.spotify.com/track/${track.id}`,
      }));
      updateTracklist(tracks);
    } catch (error) {
      console.error("Error (SpotSearch):", error);
    }
  };

  return (
    <div>
      {!token ? (
        <SpotifyAuth />
      ) : (
        <form onSubmit={submitHandler}>
          <input
            type="text"
            className="border-2 rounded-md p-2"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            name="searchTerm"
            placeholder="Search on Spotify"
          />
          <button type="submit">SEARCH</button>
        </form>
      )}
    </div>
  );
};

export default SpotSearch;
