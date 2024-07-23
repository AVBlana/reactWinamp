// src/global.d.ts
declare namespace Spotify {
  interface Error {
    message: string;
  }

  interface WebPlaybackInstance {
    device_id: string;
  }

  interface PlaybackState {
    track_window: {
      current_track: Track;
      previous_tracks: Track[];
    };
  }

  interface Track {
    uri: string;
    id: string;
    name: string;
    album: {
      uri: string;
      images: { url: string }[];
    };
    artists: { uri: string; name: string }[];
  }

  class Player {
    constructor(options: {
      name: string;
      getOAuthToken: (cb: (spotifyToken: string) => void) => void;
    });

    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, cb: (arg: any) => void): void;
    removeListener(event: string, cb?: (arg: any) => void): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    seek(position: number): Promise<void>;
    getCurrentState(): Promise<PlaybackState | null>;
  }
}
