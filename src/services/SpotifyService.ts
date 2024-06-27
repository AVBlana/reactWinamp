import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const setSpotifyToken = (token: string) => {
  spotifyApi.setAccessToken(token);
};

export const getSpotifyTrack = async (trackId: string) => {
  const response = await spotifyApi.getTrack(trackId);
  return response;
};
