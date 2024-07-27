import axios from "axios";
import { Track } from "@spotify/web-api-ts-sdk";

const API_BASE_URL = "https://api.spotify.com/v1";

export const fetchCurrentUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && !error.response?.status) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    throw error;
  }
};

export const searchSpotify = async (searchTerm: string, token: string) => {
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
    return data.tracks.items as Track[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createPlaylist = async (
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

export const savePlaylistToSpotify = async (trackId: string, token: string) => {
  try {
    await axios.put(
      `${API_BASE_URL}/me/tracks?ids=${trackId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
