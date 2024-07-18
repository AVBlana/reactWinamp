import { FormEventHandler, useState } from "react";
import { TrackType } from "./Track";

const SpotSearch = ({
  token,
  updateTracklist,
}: {
  token: string | null;
  updateTracklist: (tracks: TrackType[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const CLIENT_ID = `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`;
  const REDIRECT_URI = "http://localhost:3000/callback";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = [
    "playlist-modify-private",
    "playlist-modify-public",
    "user-library-modify",
  ];

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

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
      console.error("Error (SearchBar):", error);
    }
  };

  return (
    <div>
      {!token ? (
        <button className="spotBtn flex p-4 bg-green-600 text-white font-semibold rounded-md">
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
          >
            Login to Spotify
          </a>
        </button>
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
