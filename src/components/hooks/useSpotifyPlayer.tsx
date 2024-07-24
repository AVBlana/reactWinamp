import { useState, useEffect, useCallback } from "react";
import { PlayerActualState } from "../../types/playerTypes";

const useSpotifyPlayer = (token: string) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [hasSong, setHasSong] = useState<boolean>(false);
  const [playerState, setPlayerState] = useState<PlayerActualState>({
    position: 0,
    isPlaying: false,
    isDone: false,
  });

  useEffect(() => {
    if (!token) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
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
            setIsDone(state.track_window.previous_tracks.length > 0);
          }
        }
      );

      newPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsEnabled(true);
      });

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

      setPlayer(newPlayer);
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  const start = useCallback(
    (trackUri: string) => {
      if (isEnabled && deviceId) {
        setHasSong(true);
        return fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: [trackUri] }),
          }
        )
          .then(() => getState(true))
          .catch(() => getState());
      } else {
        throw new Error("SpotifyPlayer is not enabled");
      }
    },
    [deviceId, isEnabled, token]
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
  }, [isEnabled, player]);

  const pause = useCallback(() => {
    if (isEnabled && player) {
      player.pause();
      return getState();
    } else {
      throw new Error("SpotifyPlayer is not enabled");
    }
  }, [isEnabled, player]);

  const seek = useCallback(
    (position: number) => {
      if (isEnabled && player) {
        return player
          .seek(position)
          .then(() => getState(undefined, position))
          .catch(() => getState());
      } else {
        throw new Error("SpotifyPlayer is not enabled");
      }
    },
    [isEnabled, player]
  );

  const stop = useCallback(() => {
    if (isEnabled && player) {
      hasSong && player.pause();
      return Promise.resolve({
        position: 0,
        isPlaying: false,
        isDone: true,
      });
    } else {
      throw new Error("SpotifyPlayer is not enabled");
    }
  }, [isEnabled, player, hasSong]);

  const getState = useCallback(
    async (isPlaying?: boolean, position?: number) => {
      if (isDone) {
        setIsDone(false);
        return Promise.resolve({
          position: 0,
          isPlaying: false,
          isDone: true,
        });
      }

      try {
        const playbackState = await getPlaybackState();
        return {
          position: position || playbackState?.progress_ms || 0,
          isPlaying: isPlaying || playbackState?.is_playing,
          isDone: false,
        };
      } catch {
        return {
          position: 0,
          isPlaying: false,
          isDone: false,
        };
      }
    },
    [isDone]
  );

  const getPlaybackState = useCallback(() => {
    return fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 204) {
        return Promise.resolve(undefined);
      }
      return response.json();
    });
  }, [token]);

  // Update playerState whenever getState is called
  useEffect(() => {
    const updateState = async () => {
      const state = await getState();
      setPlayerState(state);
    };

    updateState();
  }, [getState]);

  return { start, play, pause, seek, stop, getState, playerState };
};

export default useSpotifyPlayer;
