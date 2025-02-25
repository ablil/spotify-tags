/* eslint-disable */
import axios from "axios";
import { Track } from "./types";

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token != null) {
      if (config.headers) {
        config.headers["x-spotify-access-token"] = token;
      }
    } else {
      console.warn("token is NOT set on sessionStorage");
    }
    return config;
  },
  (err) => Promise.reject(err),
);
export interface SpotifyAPI {
  fetchAllTracks: () => Promise<Array<Track>>;
  patchTrack: (trackId: string, tags: Array<string>) => Promise<Track>;
  deleteTrack: (trackId: string) => Promise<void>;
  createPlaylist: (tracks: string[], tags: string[]) => Promise<unknown>;
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
    createPlaylist: async (tracks, tags) => {
      const response = await axios.post<unknown>("/api/playlists", { tracks, tags });
      return response.data;
    },
  };
}
