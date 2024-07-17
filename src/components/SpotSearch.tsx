import React, { useState } from "react";
import { searchSpotifyTrack, SpotifySong } from "../services/SpotifyService";

const SpotSearch = () => {
  const [searchFor, setSearchFor] = useState("");
  const [songData, setSongData] = useState<SpotifySong | null>(null);

  const handleSearch = async () => {
    try {
      const result = await searchSpotifyTrack(searchFor);
      setSongData(result);
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchFor}
        onChange={(e) => setSearchFor(e.target.value)}
        placeholder="Search for a song..."
      />
      <button onClick={handleSearch}>Search</button>
      {songData ? (
        <div>
          <h1>{songData.name}</h1>
          <p>{songData.artists[0].name}</p>
          <img src={songData.album.images[0].url} alt="Album Cover" />
        </div>
      ) : (
        <p>No song found.</p>
      )}
    </div>
  );
};

export default SpotSearch;
