import axios from "axios";
import { Track } from "./types";

export async function fetchAllTracks(): Promise<Array<Track>> {
  const response = await axios.get<Array<Track>>("/api/tracks");
  return response.data;
}

export async function patchTrack(trackId: string, tags: Array<string>): Promise<Track> {
  const response = await axios.patch<Track>("/api/tracks/" + trackId, { tags });
  return response.data;
}

export async function deleteTrack(trackId: string): Promise<void> {
  await axios.delete<void>("/api/tracks/" + trackId);
}
