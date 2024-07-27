import { useState, useEffect, useCallback, useRef } from "react";
import { PlayerActualState } from "../../types/playerTypes";

interface TrackData {
  title: string;
  artist: string;
  albumCover: string | null;
}

const useSpotifyPlayer = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [playerState, setPlayerState] = useState<PlayerActualState>({
    position: 0,
    isPlaying: false,
    isDone: false,
  });
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  const isInitialized = useRef(false);
  const playerRef = useRef<Spotify.Player | null>(null);

  const refreshToken = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch("http://localhost:3000/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("token"),
        }),
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);
      return data.accessToken; // Ensure it returns a value
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }, []); // Add dependencies if necessary

  const getPlaybackState = useCallback(async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // Token might be expired, try refreshing
        await refreshToken();
      }

      if (response.status === 204) {
        return undefined;
      }

      const data = await response.json();
      console.log("Playback state data:", data); // Debugging line
      return data;
    } catch (error) {
      console.error("Error fetching playback state:", error);
      throw error;
    }
  }, [token, refreshToken]);

  const getState = useCallback(
    async (isPlaying?: boolean, position?: number) => {
      try {
        const playbackState = await getPlaybackState();

        if (!playbackState || !playbackState.item) {
          return { position: 0, isPlaying: false, isDone: false };
        }

        return {
          position: position ?? playbackState.progress_ms ?? 0,
          isPlaying: isPlaying ?? playbackState.is_playing ?? false,
          isDone:
            playbackState.is_playing === false &&
            playbackState.progress_ms === playbackState.duration_ms,
        };
      } catch (error) {
        console.error("Error getting state:", error);
        return { position: 0, isPlaying: false, isDone: false };
      }
    },
    [getPlaybackState]
  );

  useEffect(() => {
    if (!token || isInitialized.current) return;

    isInitialized.current = true;

    const initializePlayer = () => {
      if (window.Spotify) {
        const newPlayer = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: (token: string) => void) => cb(token),
        });

        newPlayer.addListener(
          "initialization_error",
          ({ message }: { message: string }) =>
            console.error("Initialization error:", message)
        );
        newPlayer.addListener(
          "authentication_error",
          ({ message }: { message: string }) =>
            console.error("Authentication error:", message)
        );
        newPlayer.addListener(
          "account_error",
          ({ message }: { message: string }) =>
            console.error("Account error:", message)
        );
        newPlayer.addListener(
          "playback_error",
          ({ message }: { message: string }) =>
            console.error("Playback error:", message)
        );

        newPlayer.addListener(
          "player_state_changed",
          (state: Spotify.PlaybackState | null) => {
            if (state) {
              setPlayerState({
                position: state.position,
                isPlaying: !state.paused,
                isDone: state.track_window.previous_tracks.length > 0,
              });
            }
          }
        );

        newPlayer.addListener(
          "ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Ready with Device ID", device_id);
            setDeviceId(device_id);
            setIsEnabled(true);
          }
        );

        newPlayer.addListener(
          "not_ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Device ID has gone offline", device_id);
            setDeviceId("");
            setIsEnabled(false);
          }
        );

        newPlayer.connect().then((success: boolean) => {
          if (success) {
            console.log("The Spotify Player has connected successfully");
          }
        });

        playerRef.current = newPlayer;
        setPlayer(newPlayer);
      }
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onload = initializePlayer;
    document.body.appendChild(script);

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
      document.body.removeChild(script);
      isInitialized.current = false;
    };
  }, [token]);

  const start = useCallback(
    async (trackUri: string) => {
      if (isEnabled && deviceId) {
        alert(isEnabled);
        try {
          await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uris: [trackUri],
              }),
            }
          );
        } catch (error) {
          console.error("Error starting playback:", error);
        }
      }
    },
    [isEnabled, deviceId, token]
  );

  const play = useCallback(() => {
    if (isEnabled && player) {
      return player
        .resume()
        .then(() => getState(true))
        .catch(() => getState());
    } else {
      throw new Error("SpotifyPlayer is not enabled");
    }
  }, [isEnabled, player, getState]);

  const pause = useCallback(async () => {
    if (isEnabled && player) {
      try {
        await player.pause(); // Assuming player.pause() returns a promise
        await getState(false); // If getState returns a promise
      } catch (error) {
        await getState(); // Handle or log the error
        throw error; // Re-throw the error if needed
      }
    } else {
      throw new Error("SpotifyPlayer is not enabled");
    }
  }, [isEnabled, player, getState]);

  const seek = useCallback(
    (position: number) => {
      if (isEnabled && player) {
        return player.seek(position);
      } else {
        throw new Error("SpotifyPlayer is not enabled");
      }
    },
    [isEnabled, player]
  );

  const stop = useCallback(async () => {
    try {
      if (isEnabled && deviceId) {
        await fetch(
          `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error stopping playback:", error);
    }
  }, [isEnabled, deviceId, token]);

  return {
    start,
    play,
    pause,
    seek,
    stop,
    playerState,
    refreshToken,
  };
};

export default useSpotifyPlayer;
