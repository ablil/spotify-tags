"use client";
import {
  loadAllTracksAction,
  useAppDispatch
} from "@/lib/store";
import { useEffect } from "react";
import AudioPlayer from "./player/AudioPlayer";
import TracksTable from "./tracks/TracksTable";
import TrackSearchInput from "./TrackSearchInput";

const TrackList = () => {
  const dispatcher = useAppDispatch();

  useEffect(() => {
    dispatcher(loadAllTracksAction());
  }, []);

  return (
    <div className="bg-zinc-900 p-4 md:m-4 rounded-md">
      <header className="flex items-center">
        <h1 className="text-white capitlize mb-4 mr-auto">Tracks</h1>
        <TrackSearchInput className="mx-2" />
        <select name="sort" id="sort" className="bg-transparent opacity-50 text-sm">
          <option value="last_updated">Sort by last updated</option>
          <option value="title">Sort by title</option>
        </select>
      </header>
      <TracksTable />
      <AudioPlayer />
    </div>
  );
};


export default TrackList;
