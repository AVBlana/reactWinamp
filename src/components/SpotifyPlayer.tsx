// SpotifyPlayer.tsx
import React, { useEffect } from "react";

const SpotifyPlayer: React.FC = () => {
  useEffect(() => {
    // Load the Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Ensure the Spotify SDK is loaded
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = "YOUR_ACCESS_TOKEN"; // Replace with your Spotify access token

        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb: (token: string) => void) => {
            cb(token);
          },
        });

        // Error handling
        player.addListener(
          "initialization_error",
          ({ message }: { message: string }) => console.error(message)
        );
        player.addListener(
          "authentication_error",
          ({ message }: { message: string }) => console.error(message)
        );
        player.addListener(
          "account_error",
          ({ message }: { message: string }) => console.error(message)
        );
        player.addListener(
          "playback_error",
          ({ message }: { message: string }) => console.error(message)
        );

        // Playback status updates
        player.addListener("player_state_changed", (state: any) =>
          console.log(state)
        );

        // Ready
        player.addListener("ready", ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);

          // Play a track
          player.connect().then((success: boolean) => {
            if (success) {
              player.play({
                uris: ["spotify:track:YOUR_TRACK_URI"], // Replace with your track URI
              });
            }
          });
        });

        // Not Ready
        player.addListener(
          "not_ready",
          ({ device_id }: { device_id: string }) => {
            console.log("Device ID has gone offline", device_id);
          }
        );
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div>Your Spotify player component</div>;
};

export default SpotifyPlayer;
