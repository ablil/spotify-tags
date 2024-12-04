import axios from "axios";
import { Track } from "./types";

export interface SpotifyAPI {
  fetchAllTracks: () => Promise<Array<Track>>;
  patchTrack: (trackId: string, tags: Array<string>) => Promise<Track>;
  deleteTrack: (trackId: string) => Promise<void>;
}

export function createSpotifyAPI(): SpotifyAPI {
  return {
    fetchAllTracks: async () => {
      const response = await axios.get<Array<Track>>("/api/tracks");
      return response.data;
    },
    patchTrack: async (trackId, tags) => {
      const response = await axios.patch<Track>("/api/tracks/" + trackId, { tags });
      return response.data;
    },
    deleteTrack: async (trackId) => {
      await axios.delete<void>("/api/tracks/" + trackId);
    },
  };
}
