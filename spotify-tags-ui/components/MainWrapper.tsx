"use client";
import {
  loadAllTracksAction,
  useAppDispatch
} from "@/lib/store";
import { useEffect } from "react";
import TagsFilters from "./tags/TagsFilters";
import TracksTable from "./tracks/TracksTable";
import AudioPlayer from "./player/AudioPlayer";

const TrackList = () => {
  const dispatcher = useAppDispatch();

  useEffect(() => {
    dispatcher(loadAllTracksAction());
  }, []);

  return (
    <div className="bg-zinc-900 p-4 md:m-4 rounded-md">
      <TagsFilters />
      <TracksTable />
      <AudioPlayer />
    </div>
  );
};


export default TrackList;
