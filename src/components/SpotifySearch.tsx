// url: `https://open.spotify.com/track/${track.id}`

import React, { FormEventHandler, useState } from "react";
import SpotifyAuth from "./SpotifyAuth";
import { searchSpotify } from "../services/SpotifyService";
import { searchYtVideo, YoutubeVideo } from "../services/YouTubeService";
import { Track } from "@spotify/web-api-ts-sdk";
import { ServiceType, Song } from "../types/playerTypes";

const SpotSearch = ({
  token,
  updateTracklist,
}: {
  token: string | null;
  updateTracklist: (tracks: Song[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      const requests = [
        searchSpotify(searchTerm, token),
        searchYtVideo(searchTerm),
      ];
      const results = await Promise.all(requests);
      console.log(results);

      let songs = [];
      const spotifySongs = results[0] as Track[];
      const youtubeSongs = results[1] as YoutubeVideo[];
      songs = [
        ...spotifySongs.map((item) => {
          return {
            id: item.id,
            artist: {
              id: item.artists[0].id,
              name: item.artists[0].name,
            },
            artwork: {
              small: item.album.images[2],
              medium: item.album.images[1],
              big: item.album.images[0],
            },
            title: item.name,
            type: ServiceType.Spotify,
          } as Song;
        }),
        ...youtubeSongs.map((item) => {
          return {
            artist: {
              id: item.snippet.channelId,
              name: item.snippet.channelTitle,
            },
            artwork: {
              small: item.snippet.thumbnails?.default,
              medium: item.snippet.thumbnails?.medium,
              big: item.snippet.thumbnails?.high,
            },
            id: item.id.videoId,
            title: item.snippet.title,
            type: ServiceType.Youtube,
          } as Song;
        }),
      ];

      updateTracklist(songs);
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
