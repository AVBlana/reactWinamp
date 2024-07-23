// spotify-web-playback-sdk.d.ts
declare namespace Spotify {
  interface Player {
    new (options: PlayerOptions): Player;
    connect(): Promise<boolean>;
    disconnect(): void;
    resume(): Promise<void>;
    pause(): void;
    seek(position_ms: number): Promise<void>;
    setVolume(volume: number): Promise<void>;
    getCurrentState(): Promise<PlaybackState | undefined>;
    on(
      event: "ready" | "not_ready",
      callback: (data: { device_id: string }) => void
    ): void;
    on(
      event: "player_state_changed",
      callback: (state: PlaybackState | null) => void
    ): void;
    on(
      event:
        | "initialization_error"
        | "authentication_error"
        | "account_error"
        | "playback_error",
      callback: (error: { message: string }) => void
    ): void;
    off(event: string, callback: Function): void;
  }

  interface PlayerOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
  }

  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: {
      current_track: Track;
      previous_tracks: Track[];
    };
    volume: number;
  }

  interface Track {
    id: string;
    uri: string;
    name: string;
    artists: Artist[];
    album: Album;
  }

  interface Artist {
    name: string;
    id: string;
    uri: string;
  }

  interface Album {
    name: string;
    id: string;
    uri: string;
    images: Image[];
  }

  interface Image {
    height: number;
    width: number;
    url: string;
  }
}
